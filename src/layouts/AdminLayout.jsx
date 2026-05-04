import { useState } from "react";
import Header from "../components/layout/Header";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";
import LoadingJump from "../components/overlay/JumpLoading";
import styles from "../styles/Layout.module.css";
import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Header setIsLoading={setIsLoading} />
      <main className={styles.main}>
        <Sidebar />
        <Outlet context={{ setIsLoading }} />
      </main>
      <Footer />
      <InteractiveBackground />
      {isLoading && <LoadingJump />}
    </>
  );
}
