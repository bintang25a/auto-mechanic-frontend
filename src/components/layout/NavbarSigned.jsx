import {
  MdAppRegistration,
  MdDashboard,
  MdHistory,
  MdHome,
  MdLogout,
  MdPerson,
  MdPublishedWithChanges,
} from "react-icons/md";
import styles from "../../styles/Layout.module.css";
import { Link } from "react-router-dom";

export default function NavbarSigned({ isOpen, isTablet, user, handleLogout }) {
  const style = {
    navbar: `${styles.navbar} ${isOpen && "open"}`,
    profile: isTablet ? styles?.profile : styles.profileOff,
    photo: styles.photo,
    text: styles.text
  };

  return (
    <nav className={style.navbar}>
      <div className={style.profile}>
        <div className={style.photo}>
          {user?.photo ? <img src="" alt="Photo" /> : "Photo"}
        </div>

        <div className={style.text}>
          <h2>{user?.name}</h2>
          <span>
            {user?.role} || {user?.email}
          </span>
        </div>

        <button title="logout" onClick={handleLogout}>
          <MdLogout />
        </button>
      </div>

      {(user?.role === "admin" || user?.role === "staff") && (
        <Link to={`/${user?.role}`}>
          <MdDashboard /> Dashboard
        </Link>
      )}

      <Link to={"/"}>
        <MdHome /> Home
      </Link>
      <Link to={"/service"}>
        <MdAppRegistration /> Service Application
      </Link>
      <Link to={"/service/status"}>
        <MdPublishedWithChanges /> Service Status
      </Link>
      <Link to={"/service/history"}>
        <MdHistory /> Service History
      </Link>
      <Link to={"/profile"}>
        <MdPerson /> Profile
      </Link>
    </nav>
  );
}
