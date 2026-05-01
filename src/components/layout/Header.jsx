import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdAppRegistration,
  MdClose,
  MdHistory,
  MdHome,
  MdLogin,
  MdMenu,
  MdPerson,
  MdPersonAddAlt,
  MdPublishedWithChanges,
} from "react-icons/md";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Layout.module.css";

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

function SignedNavbar({ isOpen }) {
  return (
    <nav className={`navbar ${isOpen && "open"}`}>
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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

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
    const token = localStorage.getItem("token");

    if (token) {
      setIsLogin(true);
    }
  }, []);

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
        <SignedNavbar isOpen={isOpen} />
      )}
    </header>
  );
}
