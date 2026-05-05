import { useState } from "react";
import Header from "../components/layout/Header";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";
import LoadingJump from "../components/overlay/JumpLoading";
import styles from "../styles/Layout.module.css";
import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import InfoModal from "../components/overlay/InfoModal";

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    isError: false,
    title: "",
    message: "",
  });

  return (
    <>
      <Header setIsLoading={setIsLoading} />
      <main className={styles.main}>
        <Sidebar />
        <Outlet context={{ setIsLoading, setModal }} />
      </main>
      <Footer />
      {isLoading && <LoadingJump />}
      <InfoModal
        isOpen={modal?.isOpen}
        isError={modal?.isError}
        onClose={() => setModal({ isOpen: false })}
        title={modal?.title}
        message={modal?.message}
      />
      <InteractiveBackground />
    </>
  );
}
