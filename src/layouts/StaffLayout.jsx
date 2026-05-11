import { useState } from "react";
import Header from "../components/layout/Header";
import styles from "../styles/Layout.module.css";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
import LoadingJump from "../components/overlay/JumpLoading";
import ConfirmModal from "../components/overlay/ConfirmModal";
import InfoModal from "../components/overlay/InfoModal";

export default function StaffLayout() {
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
    onClose: null,
    title: "",
    message: "",
  });

  return (
    <>
      <div className={styles.serviceLayout}>
        <Header setIsLoading={setIsLoading} setRefresh={() => {}} />
        <Outlet context={{ setIsLoading, setConfirmModal, setInfoModal }} />
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
        onClose={
          infoModal?.onClose
            ? infoModal?.onClose
            : () => setInfoModal({ isOpen: false })
        }
        title={infoModal?.title}
        message={infoModal?.message}
      />
    </>
  );
}
