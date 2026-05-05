import { useState } from "react";
import Header from "../components/layout/Header";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";
import LoadingJump from "../components/overlay/JumpLoading";
import styles from "../styles/Layout.module.css";
import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import InfoModal from "../components/overlay/InfoModal";
import ConfirmModal from "../components/overlay/ConfirmModal";

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    onCancel: () => {},
    onSubmit: () => {},
    title: "",
    message: "",
  });
  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    isError: false,
    title: "",
    message: "",
  });
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <div className={styles?.layout}>
        <Header setIsLoading={setIsLoading} setRefresh={setRefresh} />
        <main className={styles.main}>
          <Sidebar />
          <Outlet
            context={{ setIsLoading, setInfoModal, setConfirmModal, refresh }}
          />
        </main>
        <Footer />
      </div>

      {isLoading && <LoadingJump />}
      <InteractiveBackground />
      <ConfirmModal
        isOpen={confirmModal?.isOpen}
        onCancel={confirmModal?.onCancel}
        onSubmit={confirmModal?.onSubmit}
        title={confirmModal?.title}
        message={confirmModal?.message}
      />
      <InfoModal
        isOpen={infoModal?.isOpen}
        isError={infoModal?.isError}
        onClose={() => setInfoModal({ isOpen: false })}
        title={infoModal?.title}
        message={infoModal?.message}
      />
    </>
  );
}
