import InteractiveBackground from "../../components/background/interactiveBackground";
import Footer from "../../components/layout/Footer";
import logo from "/images/logo/logo-nobg.png";
import styles from "../../styles/Auth.module.css";
import {
  FaEnvelope,
  FaIdCard,
  FaLock,
  FaRightFromBracket,
  FaUpload,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa6";
import { useState } from "react";
import { register } from "../../_services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const form = {
    uid: "",
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPass: "",
    photo: "",
  };

  const [formData, setFormData] = useState(form);

  const handleChange = (e) => {
    const { value, name, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];

      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPass) {
      alert("Konfirmasi password tidak sesuai!");
      return;
    }

    const payload = new FormData();

    payload.append("uid", formData.uid);
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone_number", formData.phone_number);
    payload.append("password", formData.password);
    payload.append("role", "customer");

    if (formData.photo) {
      payload.append("photo", formData.photo);
    }

    try {
      await register(payload);
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
            <h2>Register</h2>
          </header>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-container">
              <div className="input-container">
                <label htmlFor="photo">
                  {formData?.photoPreview ? (
                    <img
                      src={formData?.photoPreview}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <>
                      <FaUpload /> Upload Photo (optional)
                    </>
                  )}
                </label>
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  name="photo"
                  id="photo"
                  onChange={handleChange}
                />
              </div>
              <div className="input-container">
                <input
                  type="text"
                  name="uid"
                  id="uid"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.uid}
                />
                <label htmlFor="uid">
                  <FaUser /> Username
                </label>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.name}
                  autoComplete="new-password"
                />
                <label htmlFor="name">
                  <FaIdCard /> Full Name
                </label>
              </div>
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
                  type="numeric"
                  name="phone_number"
                  id="phone_number"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.phone_number}
                />
                <label htmlFor="phone_number">
                  <FaWhatsapp /> Whatsapp Number
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
              <div className="input-container">
                <input
                  type="password"
                  name="confirmPass"
                  id="confirmPass"
                  placeholder=""
                  required
                  onChange={handleChange}
                  value={formData.confirmPass}
                  autoComplete="new-password"
                />
                <label htmlFor="confirmPass">
                  <FaLock /> Confirm Password
                </label>
              </div>

              <button type="submit">
                Sign Up <FaRightFromBracket />
              </button>
            </div>
          </form>

          <span>
            Already have account? <Link to="/login">Login</Link>
          </span>

          <Footer />
        </div>
      </main>
      <InteractiveBackground />
    </>
  );
}
