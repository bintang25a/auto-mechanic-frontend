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
import { getQueues } from "../../_services/queues";

export default function DashboardStaff() {
  const { setIsLoading } = useOutletContext();

  const [queues, setQueues] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const [queueData] = await Promise.all([getQueues("status=waiting")]);

      setQueues(queueData?.data);

      setTimeout(() => setIsLoading(false), 1000);
    };

    fetchData();

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
      <h1>Staff Dashboard</h1>

      <section className={styles.history}>
        <h2>{queues?.length} Queues </h2>

        <div className={styles.container}>
          {queues?.length == 0 && (
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

          {queues?.map((q) => (
            <Link
              to={q?.complaint?.complaint_number}
              key={q?.id}
              className={styles.card}
            >
              <div className={`${styles.icon} ${colorClass(q?.status)}`}>
                {q?.status === "waiting" ? (
                  <MdHourglassEmpty size={40} />
                ) : q?.status === "process" ? (
                  <MdSync size={40} />
                ) : q?.status === "done" ? (
                  <MdCheckCircle size={40} />
                ) : (
                  <MdCancel size={40} />
                )}
              </div>
              <div className={styles.info}>
                <h3>Number: {q?.complaint?.complaint_number}</h3>
                <span className={colorClass(q?.status)}>
                  Status: {q?.status}
                </span>
                <span>
                  <FaMotorcycle /> {q?.complaint?.vehicle}
                </span>
                <span>
                  <FaCalendarDays /> {formatedDate(q?.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
