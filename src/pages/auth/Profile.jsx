import { useEffect, useState } from "react";
import InteractiveBackground from "../../components/background/interactiveBackground";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { me } from "../../_services/auth";
import LoadingJump from "../../components/overlay/JumpLoading";
import styles from "../../styles/Auth.module.css";
import { MdEdit } from "react-icons/md";

const InputContainer = ({ formData, name, label, change }) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{label}</label>

      <input
        type="text"
        id={name}
        name={name}
        value={formData?.[name]}
        onChange={change}
        disabled={!isEdit}
      />

      <button title="Edit" onClick={() => setIsEdit(!isEdit)}>
        <MdEdit />
      </button>
    </div>
  );
};

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [userData] = await Promise.all([me()]);

      setUser(userData?.data);
      setFormData(userData?.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Header setIsLoading={setIsLoading} userData={user} />
      <main className={styles.main}>
        <div className={styles.profileContainer}>
          <div className={styles.bio}>
            <div className={styles.photo}>
              <img src={user?.photo} alt={user?.name} />
            </div>
            <div className={styles.name}>
              <span>{user?.name}</span>
              <span>{user?.uid}</span>
            </div>
          </div>

          <div className={styles.content}>
            <InputContainer
              formData={formData}
              label={"Name"}
              name={"name"}
              change={handleChange}
            />
            <InputContainer
              formData={formData}
              label={"UID"}
              name={"uid"}
              change={handleChange}
            />
            <InputContainer
              formData={formData}
              label={"Role"}
              name={"role"}
              change={handleChange}
            />
            <InputContainer
              formData={formData}
              label={"Email"}
              name={"email"}
              change={handleChange}
            />
            <InputContainer
              formData={formData}
              label={"Phone Number"}
              name={"phone_number"}
              change={handleChange}
            />
          </div>
        </div>
      </main>
      <Footer />

      <InteractiveBackground />
      {isLoading && <LoadingJump />}
    </>
  );
}
