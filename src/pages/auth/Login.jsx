import InteractiveBackground from "../../components/background/interactiveBackground";
import Footer from "../../components/layout/Footer";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Auth.module.css";
import { FaEnvelope, FaLock, FaRightFromBracket } from "react-icons/fa6";
import { useState } from "react";
import { login } from "../../_services/auth";
import { Link, useNavigate } from "react-router-dom";
import LoadingJump from "../../components/overlay/JumpLoading";
import InfoModal from "../../components/overlay/InfoModal";

export default function Login() {
  const navigate = useNavigate();

  const form = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(form);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    isError: false,
    title: "",
    message: "",
  });

  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "" });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);

      setModal({
        isOpen: true,
        isError: true,
        title: "Login failed",
        message: error?.message,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 250);
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
      <InfoModal
        isOpen={modal?.isOpen}
        isError={modal?.isError}
        onClose={closeModal}
        title={modal?.title}
        message={modal?.message}
      />
      {isLoading && <LoadingJump />}
    </>
  );
}
