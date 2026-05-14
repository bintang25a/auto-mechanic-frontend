import { useEffect, useState } from "react";
import {
  MdAnalytics,
  MdAssignmentAdd,
  MdCancel,
  MdCheckCircle,
  MdDashboard,
  MdFactCheck,
  MdHourglassEmpty,
  MdRestore,
  MdSync,
} from "react-icons/md";
import styles from "../../styles/Service.module.css";
import { useOutletContext, Link } from "react-router-dom";
import { FaCalendarDays, FaMotorcycle } from "react-icons/fa6";

export default function History() {
  const { setIsLoading, data, firstLoad } = useOutletContext();

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const { userData } = data;

    const { setIsFirstLoad, isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);
    }

    const complaintsData = userData?.complaints || [];

    const sortedData = [...(complaintsData || [])].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    localStorage.setItem("complaint_number", sortedData[0]?.complaint_number);

    setComplaints(sortedData);

    let conditionTimeout;

    if (sortedData) {
      conditionTimeout = setTimeout(() => {
        setIsFirstLoad(false);
        setIsLoading(false);
      }, 250);
    }

    const overlimitTimeout = setTimeout(() => {
      setIsFirstLoad(false);
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(conditionTimeout);
      clearTimeout(overlimitTimeout);
    };

    // eslint-disable-next-line
  }, []);

  const formatedDate = (isoDate) => {
    const date = new Date(isoDate);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("id-ID", options);
  };

  const colorClass = (status) => {
    if (status === "waiting") {
      return styles.waitingColor;
    } else if (status === "process") {
      return styles.processColor;
    } else if (status === "done") {
      return styles.doneColor;
    } else {
      return styles.cancelColor;
    }
  };

  return (
    <main className={styles.main}>
      <h1>Service History</h1>

      <section className={styles.history}>
        <h2>{complaints?.length} Histories </h2>

        <div className={styles.container}>
          {complaints?.length == 0 && (
            <div className={styles.card}>
              <div className={`${styles.icon} ${styles.cancelColor}`}>
                <MdCancel size={40} />
              </div>
              <div className={styles.info}>
                <h3>No Recent History</h3>
                <span className={styles.cancelColor}>Status: Nothing</span>
                <span>
                  <FaCalendarDays /> {formatedDate(new Date())}
                </span>
              </div>
            </div>
          )}

          {complaints?.map((complaint) => (
            <Link
              to={`/service/status/${complaint?.complaint_number}`}
              key={complaint?.complaint_number}
              className={styles.card}
            >
              <div
                className={`${styles.icon} ${colorClass(
                  complaint?.queue?.status
                )}`}
              >
                {complaint?.queue?.status === "waiting" ? (
                  <MdHourglassEmpty size={40} />
                ) : complaint?.queue?.status === "process" ? (
                  <MdSync size={40} />
                ) : complaint?.queue?.status === "done" ? (
                  <MdCheckCircle size={40} />
                ) : (
                  <MdCancel size={40} />
                )}
              </div>
              <div className={styles.info}>
                <h3>Number: {complaint?.complaint_number}</h3>
                <span className={colorClass(complaint?.queue?.status)}>
                  Status: {complaint?.queue?.status}
                </span>
                <span>
                  <FaMotorcycle /> {complaint?.vehicle}
                </span>
                <span>
                  <FaCalendarDays /> {formatedDate(complaint?.created_at)}
                </span>
              </div>
            </Link>
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
        <Link to={"/service/status"} className={styles.linkStatus}>
          <MdFactCheck size={30} /> Status
        </Link>
        <Link to={"/service/diagnosis"} className={styles.linkDiagnosis}>
          <MdAnalytics size={30} /> Diagnosis
        </Link>
        <Link
          to={"/service/history"}
          className={styles.linkHistory}
          style={{
            backgroundColor: `var(--btn-danger)`,
            color: `var(--platinum-gray)`,
          }}
        >
          <MdRestore size={30} /> History
        </Link>
      </section>
    </main>
  );
}
