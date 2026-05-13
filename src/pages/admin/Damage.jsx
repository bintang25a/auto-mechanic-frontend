import {
  MdAddBox,
  MdDelete,
  MdEdit,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import styles from "../../styles/Admin.module.css";
import { useEffect, useState } from "react";
import {
  createDamage,
  deleteDamage,
  getDamages,
  showDamage,
  updateDamage,
} from "../../_services/damages";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";

export default function Damage() {
  const { setIsLoading, setInfoModal, setConfirmModal, refresh } =
    useOutletContext();

  const columns = ["damage_code", "name"];
  const [damages, setDamages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState({
    column: "",
    value: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [damagesData] = await Promise.all([
        getDamages(`page=${currentPage}&per_page=20`),
      ]);

      setDamages(damagesData?.data);
      setCurrentPage(damagesData?.current_page);
      setTotalPages(Math.ceil(Number(damagesData?.total) / 20));

      setTimeout(() => setIsLoading(false), 250);
    };

    fetchData();
    // eslint-disable-next-line
  }, [refresh]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isEmpty = !search?.value || !search?.column;
    const query = isEmpty ? "" : `${search?.column}=${search?.value}`;

    const [damagesData] = await Promise.all([getDamages(query)]);

    setDamages(damagesData?.data);
    setCurrentPage(damagesData?.current_page);
    setTotalPages(Math.ceil(Number(damagesData?.total) / 20));

    setTimeout(() => setIsLoading(false), 250);
  };

  const handleChangePage = async (isNext) => {
    setIsLoading(true);

    let page = isNext ? currentPage + 1 : currentPage - 1;

    const query =
      search?.column && search?.value
        ? `${search?.column}=${search?.value}`
        : "";

    const [damagesData] = await Promise.all([
      getDamages(`page=${page}&${query}&per_page=20`),
    ]);

    setCurrentPage(page);
    setDamages(damagesData?.data);
    setTimeout(() => setIsLoading(false), 250);
  };

  const [isView, setIsView] = useState(false);
  const [editData, setEditData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fields = [
    {
      name: "damage_code",
      label: "Damage Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "symptoms",
      label: "Symptoms code possible",
      type: "text",
    },
  ];

  const handleFetchSymptom = async (id, view = false) => {
    setIsLoading(true);

    try {
      const response = await showDamage(id);
      const data = response?.data;
      const symptoms = response?.data?.symptoms;

      setIsView(view ? true : false);
      setEditData({
        ...data,
        symptoms: symptoms?.map((d) => d.symptom_code).join(", "),
      });
    } catch (error) {
      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Get data failed",
        message: error?.message,
      });
    } finally {
      setIsLoading(false);
    }

    setModalOpen(true);
  };

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();

    payload.append("damage_code", formData?.damage_code);
    payload.append("name", formData?.name);

    if (editData) {
      payload.append("_method", "PUT");
    }

    try {
      const response = !editData
        ? await createDamage(payload)
        : await updateDamage(editData?.damage_code, payload);

      if (editData) {
        const tempDamages = [...damages];

        const userIdx = tempDamages.findIndex(
          (symptom) => symptom?.damage_code === editData?.damage_code
        );

        if (userIdx !== -1) {
          tempDamages[userIdx] = response?.data;
          setDamages(tempDamages);
        }
      }

      setInfoModal({
        isOpen: true,
        title: "Success",
        message: response?.message,
      });

      setEditData(false);
      setModalOpen(false);
    } catch (error) {
      console.error(error?.response?.message);

      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Create data failed",
        message: error?.message,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 250);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditData(false);
    setIsView(false);
  };

  const handleDelete = (id) => {
    const onSubmit = async () => {
      setConfirmModal({});
      setIsLoading(true);

      try {
        const response = await deleteDamage(id);

        setDamages(damages?.filter((u) => u?.damage_code !== id));

        setInfoModal({
          isOpen: true,
          title: "Success",
          message: response?.message,
        });
      } catch (error) {
        console.error(error?.response?.message);

        setInfoModal({
          isOpen: true,
          isError: true,
          title: "Create data failed",
          message: error?.message,
        });
      } finally {
        setTimeout(() => setIsLoading(false), 250);
      }
    };

    const onCancel = () => {
      setConfirmModal({});
    };

    setConfirmModal({
      isOpen: true,
      title: "Delete Data",
      message: `Are you sure delete user with id: ${id}? Deleted data can't be recovery`,
      onSubmit,
      onCancel,
    });
  };

  return (
    <div className={styles.userPage}>
      <header className={styles.header}>
        <h2>Damages Data</h2>

        <form onSubmit={handleSearchSubmit}>
          <div className={styles.search}>
            <select name="column" id="column" onChange={handleSearchChange}>
              <option value="">Search Category</option>
              {columns?.map((col, i) => (
                <option key={i} value={col}>
                  {col?.toUpperCase()}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="value"
              id="value"
              placeholder="Search data"
              onChange={handleSearchChange}
              value={search?.value}
            />

            <button type="submit" title="Search">
              <MdSearch />
            </button>

            <button
              type="button"
              title="Add Data"
              onClick={() => setModalOpen(true)}
            >
              <MdAddBox />
            </button>
          </div>
        </form>
      </header>

      <main className={styles.main}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Damage Code</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {damages?.map((damage) => (
                <tr
                  key={damage?.damage_code}
                  onDoubleClick={() =>
                    handleFetchSymptom(damage?.damage_code, true)
                  }
                  title="Double click to view"
                >
                  <td>{damage?.damage_code}</td>
                  <td>{damage?.name}</td>
                  <td>
                    <button
                      title="View"
                      onClick={() =>
                        handleFetchSymptom(damage?.damage_code, true)
                      }
                    >
                      <MdVisibility />
                    </button>
                    <button
                      title="Edit"
                      onClick={() => handleFetchSymptom(damage?.damage_code)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(damage?.damage_code)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className={styles.footer}>
        <button
          onClick={() => handleChangePage(false)}
          disabled={currentPage <= 1}
        >
          Prev Page
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handleChangePage(true)}
          disabled={currentPage >= totalPages}
        >
          Next Page
        </button>
      </footer>

      {modalOpen && (
        <FormModal
          fields={fields}
          data={editData}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          isView={isView}
        />
      )}
    </div>
  );
}
