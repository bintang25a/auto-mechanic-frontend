import { useEffect, useRef, useState } from "react";
import styles from "../../styles/Service.module.css";
import { showComplaint } from "../../_services/complaints";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  MdAnalytics,
  MdAssignmentAdd,
  MdDashboard,
  MdFactCheck,
  MdRestore,
} from "react-icons/md";

const DiagnosisItem = ({ d }) => {
  const spanRef = useRef(null);
  const barRef = useRef(null);
  const [isBarLonger, setIsBarLonger] = useState(false);

  useEffect(() => {
    if (spanRef.current && barRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      const barWidth = barRef.current.offsetWidth;

      // Cek siapa yang lebih panjang
      if (barWidth > spanWidth) {
        setIsBarLonger(true);
      } else {
        setIsBarLonger(false);
      }
    }
  }, [d?.rate]); // Jalankan ulang jika rate berubah

  return (
    <div className={styles.progressContainer}>
      <span
        ref={spanRef}
        style={{
          color: isBarLonger ? "var(--platinum-gray)" : "var(--midnight-blue)",
        }}
      >
        [{d?.code}]-{d?.name} [{d?.rate}]
      </span>

      <div
        ref={barRef}
        className={styles.progressBar}
        style={{ width: d?.rate }}
      ></div>
    </div>
  );
};

export default function Status() {
  const { setIsLoading } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState({});
  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
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
      setIsLoading(false);
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  if (!complaint?.complaint_number) {
    return (
      <main className={styles.main}>
        <h1>No service found, Please make an apply first</h1>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>{complaint?.complaint_number}</h1>

      <section className={styles.status}>
        <h2>Status</h2>
        <div className={styles.divider}>
          <span>Queue</span>
          <span>Status</span>
        </div>
        <div className={styles.divider}>
          <span>: {complaint?.queue?.queue_number}</span>
          <span>: {complaint?.queue?.status}</span>
        </div>
      </section>

      <section className={styles.status}>
        <h2>Customer</h2>
        <div className={styles.divider}>
          <span>Name</span>
          <span>Username</span>
          <span>Phone Number</span>
          <span>Vehicle</span>
          <span>License Number</span>
        </div>
        <div className={styles.divider}>
          <span>: {complaint?.customer?.name}</span>
          <span>: {complaint?.customer?.id}</span>
          <span>: {complaint?.customer?.phone_number}</span>
          <span>: {complaint?.vehicle}</span>
          <span>: {complaint?.license_number}</span>
        </div>
      </section>

      <section className={styles.status}>
        <h2>Service</h2>
        <div className={styles.description}>
          Description: {complaint?.description}
        </div>
        <div className={styles.divider}>
          <span>Symptoms</span>
          {complaint?.symptoms?.map((s) => (
            <span key={s?.code}>
              [{s?.code}]-{s?.name}
            </span>
          ))}
        </div>
        <div className={styles.divider}>
          <span>Diagnosis Result</span>

          {complaint?.diagnosis?.map((d) => (
            <DiagnosisItem key={d?.code} d={d} />
          ))}
        </div>
      </section>

      <section className={styles.action}>
        <Link to={"/service"} className={styles.linkApplication}>
          <MdDashboard size={30} /> App
        </Link>
        <Link to={"/service/add"} className={styles.linkService}>
          <MdAssignmentAdd size={30} /> Service
        </Link>
        <Link
          to={"/service/status"}
          className={styles.linkStatus}
          style={{ backgroundColor: `var(--btn-save)` }}
        >
          <MdFactCheck size={30} /> Status
        </Link>
        <Link to={"/service/diagnosis"} className={styles.linkDiagnosis}>
          <MdAnalytics size={30} /> Diagnosis
        </Link>
        <Link to={"/service/history"} className={styles.linkHistory}>
          <MdRestore size={30} /> History
        </Link>
      </section>
    </main>
  );
}
