import InteractiveBackground from "../../components/background/interactiveBackground";
import Footer from "../../components/layout/Footer";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Auth.module.css";
import { FaEnvelope, FaLock, FaRightFromBracket } from "react-icons/fa6";
import { useState } from "react";
import { login } from "../../_services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const form = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(form);

  const handleChange = (e) => {
    const { value, name } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData);
      alert("Berhasil daftar di AutoMechanic!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Pendaftaran gagal.");
    }
  };

  return (
    <>
      <main className={styles.main}>
        <div className="auth-container">
          <header>
            <div className="logo">
              <img src={logo} alt="Logo" />
              <h1>
                Auto<span>Mechanic</span>
              </h1>
            </div>
            <h2>Login</h2>
          </header>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-container">
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.email}
                />
                <label htmlFor="email">
                  <FaEnvelope /> Email
                </label>
              </div>
              <div className="input-container">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.password}
                  autoComplete="new-password"
                />
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
              </div>

              <button type="submit">
                Sign In <FaRightFromBracket />
              </button>
            </div>
          </form>

          <span>
            Did not have account? <Link to="/register">Register</Link>
          </span>

          <Footer />
        </div>
      </main>
      <InteractiveBackground />
    </>
  );
}
