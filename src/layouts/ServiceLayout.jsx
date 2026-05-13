import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import styles from "../styles/Layout.module.css";
import InteractiveBackground from "../components/background/interactiveBackground";
import Footer from "../components/layout/Footer";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingJump from "../components/overlay/JumpLoading";
import ConfirmModal from "../components/overlay/ConfirmModal";
import InfoModal from "../components/overlay/InfoModal";
import { showUser } from "../_services/users";
import { showComplaint } from "../_services/complaints";
import { getSymptoms } from "../_services/symptoms";
import { getDamages } from "../_services/damages";
import { getRules } from "../_services/rules";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Memaksa scroll ke paling atas
    window.scrollTo(0, 0);

    // Atau jika ingin efek halus (smooth):
    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]); // Akan jalan setiap kali URL berubah

  return null; // Komponen ini tidak perlu merender apa pun
};

export default function ServiceLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
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

  const [user, setUser] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [damages, setDamages] = useState([]);
  const [rules, setRules] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const initApp = async () => {
      setIsChecking(true);

      const localUser = localStorage.getItem("user");
      const userParse = localUser ? JSON.parse(localUser) : null;

      if (userParse?.uid) {
        try {
          const userData = await showUser(userParse?.uid);
          setUser(userData?.data);
        } catch (error) {
          console.error("Gagal ambil user", error);
        }
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location?.pathname?.includes("/service/status")) {
          const complaintNumber = id
            ? id
            : localStorage.getItem("complaint_number");

          const [complaintData] = await Promise.all([
            showComplaint(complaintNumber),
          ]);

          const tempComplaint = complaintData?.data;
          if (tempComplaint?.queue?.status === "done") {
            localStorage.removeItem("complaint_number");

            navigate(`/service/status/${tempComplaint?.complaint_number}`);
          }

          setComplaint(complaintData?.data);
        } else if (location?.pathname === "/service/add") {
          const [symptomsData] = await Promise.all([getSymptoms("")]);

          setSymptoms(symptomsData?.data);
        } else if (location?.pathname === "/service/diagnosis") {
          const [symptomsData, damagesData, rulesData] = await Promise.all([
            getSymptoms(""),
            getDamages(""),
            getRules(""),
          ]);

          setSymptoms(symptomsData?.data);
          setDamages(damagesData?.data);
          setRules(rulesData?.data);
        }
      } catch (error) {
        console.log(error);

        setInfoModal({
          isOpen: true,
          isError: true,
          title: "Get data failed",
          message: error?.message,
        });
      } finally {
        setIsChecking(false);
        setIsLoading(false);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, [location]);

  if (isChecking) {
    return <LoadingJump />;
  }

  return (
    <>
      <div className={styles.serviceLayout}>
        <Header
          setIsLoading={setIsLoading}
          setRefresh={() => {}}
          userData={user}
        />
        <Outlet
          context={{
            setIsLoading,
            setConfirmModal,
            setInfoModal,
            isChecking,
            firstLoad: { isFirstLoad, setIsFirstLoad },
            data: {
              userData: user,
              complaintData: complaint,
              symptomsData: symptoms,
              damagesData: damages,
              rulesData: rules,
            },
          }}
        />
        <Footer />
      </div>

      <ScrollToTop />
      <InteractiveBackground />
      {isLoading && <LoadingJump />}
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
