import { useEffect, useState } from "react";
import InteractiveBackground from "../../components/background/interactiveBackground";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { me } from "../../_services/auth";
import LoadingJump from "../../components/overlay/JumpLoading";
import styles from "../../styles/Auth.module.css";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [userData] = await Promise.all([me()]);
      console.log(userData?.data)
      setUser(userData?.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

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
            <div className={styles.inputContainer}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user?.name}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="uid">UID</label>
              <input type="text" id="uid" name="uid" defaultValue={user?.uid} />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user?.email}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                defaultValue={user?.phone_number}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                defaultValue={user?.role}
              />
            </div>
          </div>
          <h1>Kerenn</h1>
          <h1>Kerenn</h1>
          <h1>Kerenn</h1>
          {/* <span>{JSON.stringify(user)}</span> */}
        </div>
      </main>
      <Footer />

      <InteractiveBackground />
      {isLoading && <LoadingJump />}
    </>
  );
}
