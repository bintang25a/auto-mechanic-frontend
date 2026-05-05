import {
  MdAddBox,
  MdDelete,
  MdEdit,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import styles from "../../styles/Admin.module.css";
import { useEffect, useState } from "react";
import { createUser, getUsers } from "../../_services/users";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";

export default function User() {
  const { setIsLoading, setModal } = useOutletContext();

  const columns = ["uid", "name", "email", "phone_number", "role"];
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState({
    column: "",
    value: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [usersData] = await Promise.all([getUsers("")]);

      setUsers(usersData?.data);
      setCurrentPage(usersData?.current_page);
      setTotalPages(Math.ceil(Number(usersData?.total) / 20));

      setTimeout(() => setIsLoading(false), 250);
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

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

    const [usersData] = await Promise.all([getUsers(query)]);

    setUsers(usersData?.data);
    setCurrentPage(usersData?.current_page);
    setTotalPages(Math.ceil(Number(usersData?.total) / 20));

    setTimeout(() => setIsLoading(false), 250);
  };

  const handleChangePage = async (isNext) => {
    setIsLoading(true);

    let page = isNext ? currentPage + 1 : currentPage - 1;

    const query =
      search?.column && search?.value
        ? `${search?.column}=${search?.value}`
        : "";

    const [usersData] = await Promise.all([getUsers(`page=${page}&${query}`)]);

    setCurrentPage(page);
    setUsers(usersData?.data);
    setTimeout(() => setIsLoading(false), 250);
  };

  const formatedDate = (isoDate) => {
    const date = new Date(isoDate);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("id-ID", options);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const fields = [
    {
      name: "photo",
      label: "Photo",
      type: "file",
    },
    {
      name: "uid",
      label: "UID",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
    },
    {
      name: "phone_number",
      label: "Whatsapp Number",
      type: "numeric",
    },
    {
      name: "role",
      label: "Select Role",
      type: "select",
      options: [
        {
          name: "Admin",
          value: "admin",
        },
        {
          name: "Staff",
          value: "staff",
        },
        {
          name: "Customer",
          value: "customer",
        },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "text",
    },
  ];

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();

    payload.append("uid", formData?.uid);
    payload.append("name", formData?.name);
    payload.append("email", formData?.email);
    payload.append("phone_number", formData?.phone_number);
    payload.append("password", formData?.password);
    payload.append("role", formData?.role);

    if (formData.photo) {
      payload.append("photo", formData?.photo);
    }

    try {
      const response = await createUser(payload);

      setModal({
        isOpen: true,
        title: response?.message,
        message: "",
      });

      setModalOpen(false);
    } catch (error) {
      console.error(error?.response?.message);

      setModal({
        isOpen: true,
        isError: true,
        title: "Create data failed",
        message: error?.message,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 250);
    }
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
                <th>UID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user?.uid}>
                  <td>{user?.uid}</td>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.phone_number}</td>
                  <td>{user?.role}</td>
                  <td>{formatedDate(user?.email_verified_at)}</td>
                  <td>
                    <button title="View">
                      <MdVisibility />
                    </button>
                    <button title="Edit">
                      <MdEdit />
                    </button>
                    <button title="Delete">
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
          onClose={() => setModalOpen()}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
