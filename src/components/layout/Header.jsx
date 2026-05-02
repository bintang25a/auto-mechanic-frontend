import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdAppRegistration,
  MdClose,
  MdHistory,
  MdHome,
  MdLogin,
  MdLogout,
  MdMenu,
  MdPerson,
  MdPersonAddAlt,
  MdPublishedWithChanges,
} from "react-icons/md";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Layout.module.css";
import { logout } from "../../_services/auth";

function UnsignedNavbar({ isOpen }) {
  return (
    <nav className={`navbar ${isOpen && "open"}`}>
      <Link to={"/login"}>
        <MdLogin />
        Login
      </Link>
      <Link to={"/register"}>
        <MdPersonAddAlt />
        Register
      </Link>
    </nav>
  );
}

function SignedNavbar({ isOpen, user, handleLogout }) {
  return (
    <nav className={`navbar ${isOpen && "open"}`}>
      <div className="profile">
        <div className="photo">
          {user?.photo ? <img src="" alt="Photo" /> : "Photo"}
        </div>

        <div className="text">
          <h2>{user?.name}</h2>
          <span>
            {user?.role} || {user?.email}
          </span>
        </div>

        <button title="logout" onClick={handleLogout}>
          <MdLogout />
        </button>
      </div>

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

export default function Header({ setIsLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setUser(userData ? JSON.parse(userData) : {});

    if (token) {
      setIsLogin(true);
    }

    setTimeout(() => setIsLoading(false), 500);

    // eslint-disable-next-line
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);

    await logout();

    setIsLogin(false);
    setIsOpen(false);
    navigate("/", { replace: true });

    setTimeout(() => setIsLoading(false), 250);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className="logo">
        <img src={logo} alt="Logo" />
        <h1>
          Auto<span>Mechanic</span>
        </h1>
      </div>

      <button className="menu" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>

      {!isLogin ? (
        <UnsignedNavbar isOpen={isOpen} />
      ) : (
        <SignedNavbar isOpen={isOpen} user={user} handleLogout={handleLogout} />
      )}
    </header>
  );
}
