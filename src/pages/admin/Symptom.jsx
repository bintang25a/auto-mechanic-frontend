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
  createSymptom,
  deleteSymptom,
  getSymptoms,
  showSymptom,
  updateSymptom,
} from "../../_services/symptoms";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";

export default function Symptom() {
  const { setIsLoading, setInfoModal, setConfirmModal, refresh } =
    useOutletContext();

  const columns = ["uid", "name", "email", "phone_number", "role"];
  const [symptoms, setSymptoms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState({
    column: "",
    value: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [symptomsData] = await Promise.all([
        getSymptoms(`page=${currentPage}`),
      ]);

      setSymptoms(symptomsData?.data);
      setCurrentPage(symptomsData?.current_page);
      setTotalPages(Math.ceil(Number(symptomsData?.total) / 20));

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

    const [symptomsData] = await Promise.all([getSymptoms(query)]);

    setSymptoms(symptomsData?.data);
    setCurrentPage(symptomsData?.current_page);
    setTotalPages(Math.ceil(Number(symptomsData?.total) / 20));

    setTimeout(() => setIsLoading(false), 250);
  };

  const handleChangePage = async (isNext) => {
    setIsLoading(true);

    let page = isNext ? currentPage + 1 : currentPage - 1;

    const query =
      search?.column && search?.value
        ? `${search?.column}=${search?.value}`
        : "";

    const [symptomsData] = await Promise.all([
      getSymptoms(`page=${page}&${query}`),
    ]);

    setCurrentPage(page);
    setSymptoms(symptomsData?.data);
    setTimeout(() => setIsLoading(false), 250);
  };

  const [isView, setIsView] = useState(false);
  const [editData, setEditData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fields = [
    {
      name: "symptom_code",
      label: "Symptom Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "damages",
      label: "Possible Damages Code",
      type: "text",
    },
  ];

  const handleFetchSymptom = async (id, view = false) => {
    setIsLoading(true);

    try {
      const response = await showSymptom(id);
      const data = response?.data;
      const damages = response?.data?.damages;

      setIsView(view ? true : false);
      setEditData({
        ...data,
        damages: damages?.map((d) => d.damage_code).join(", "),
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

    payload.append("uid", formData?.uid);
    payload.append("name", formData?.name);
    payload.append("email", formData?.email);
    payload.append("phone_number", formData?.phone_number);
    payload.append("role", formData?.role);

    if (formData?.password) {
      payload.append("password", formData?.password);
    }

    if (formData?.photo) {
      payload.append("photo", formData?.photo);
    }

    if (editData) {
      payload.append("_method", "PUT");
    }

    try {
      const response = !editData
        ? await createSymptom(payload)
        : await updateSymptom(editData?.symptom_code, payload);

      if (editData) {
        const tempSymptoms = [...symptoms];

        const userIdx = tempSymptoms.findIndex(
          (symptom) => symptom?.symptom_code === editData?.symptom_code
        );

        if (userIdx !== -1) {
          tempSymptoms[userIdx] = response?.data;
          setSymptoms(tempSymptoms);
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
        const response = await deleteSymptom(id);

        setSymptoms(symptoms?.filter((u) => u?.uid !== id));

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
        <h2>Users Data</h2>

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
                <th>Symptom Code</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {symptoms?.map((symptom) => (
                <tr
                  key={symptom?.symptom_code}
                  onDoubleClick={() =>
                    handleFetchSymptom(symptom?.symptom_code, true)
                  }
                  title="Double click to view"
                >
                  <td>{symptom?.symptom_code}</td>
                  <td>{symptom?.name}</td>
                  <td>
                    <button
                      title="View"
                      onClick={() =>
                        handleFetchSymptom(symptom?.symptom_code, true)
                      }
                    >
                      <MdVisibility />
                    </button>
                    <button
                      title="Edit"
                      onClick={() => handleFetchSymptom(symptom?.symptom_code)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(symptom?.uid)}
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
