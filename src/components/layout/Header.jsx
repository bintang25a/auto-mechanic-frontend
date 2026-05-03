import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdAppRegistration,
  MdClose,
  MdDashboard,
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
import { logout, me } from "../../_services/auth";

function Profile({ children, user }) {
  return (
    <div className={styles?.profile}>
      <div className="photo">
        {user?.photo ? <img src="" alt="Photo" /> : "Photo"}
      </div>

      <div className="text">
        <h2>{user?.name}</h2>
        <span>
          {user?.role} || {user?.email}
        </span>
      </div>

      {children}
    </div>
  );
}

function UnsignedNavbar({ isOpen }) {
  return (
    <nav className={`${styles.navbar} ${isOpen && "open"}`}>
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

function SignedNavbar({ isOpen, isTablet, user, handleLogout }) {
  return (
    <nav className={`${styles.navbar} ${isOpen && "open"}`}>
      {isTablet && (
        <Profile user={user}>
          <button title="logout" onClick={handleLogout}>
            <MdLogout />
          </button>
        </Profile>
      )}

      <Link to={"/"}>
        <MdHome /> Home
      </Link>
      {(user?.role === "admin" || user?.role === "staff") && (
        <Link to={`/${user?.role}`}>
          <MdDashboard /> Dashboard
        </Link>
      )}
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
    const fetchUser = async () => {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      const localUser = localStorage.getItem("user");
      const parseUser = localUser ? JSON.parse(localUser) : {};
      const resUser = await me();

      if (token) {
        setIsLogin(true);
      }

      if (token && parseUser?.role === resUser?.role) {
        setUser(parseUser);
      } else {
        setUser(resUser);
        localStorage.setItem("user", JSON.stringify(resUser));
      }

      setTimeout(() => setIsLoading(false), 500);
    };

    fetchUser();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const resUser = await me();

      if ((resUser?.role !== user?.role) & user) {
        localStorage.setItem("user", JSON.stringify(resUser));
        alert(user?.role);
      }
    };

    fetchUser();
  }, [user]);

  const handleLogout = async () => {
    setIsLoading(true);

    await logout();

    setIsLogin(false);
    setIsOpen(false);
    navigate("/", { replace: true });

    setTimeout(() => setIsLoading(false), 250);
  };

  const [isTablet, setIsTablet] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
        <h1>
          Auto<span>Mechanic</span>
        </h1>
      </div>

      <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>

      {!isLogin ? (
        <UnsignedNavbar isOpen={isOpen} />
      ) : (
        <SignedNavbar
          isOpen={isOpen}
          isTablet={isTablet}
          user={user}
          handleLogout={handleLogout}
        />
      )}

      {!isTablet && <Profile user={user} />}
    </header>
  );
}
