import {
  MdAnalytics,
  MdAssignmentAdd,
  MdCancel,
  MdCheckCircle,
  MdFactCheck,
  MdHourglassEmpty,
  MdPerson,
  MdRestore,
  MdSync,
} from "react-icons/md";
import styles from "../../styles/Service.module.css";
import { Link } from "react-router-dom";
import { FaCalendarDays, FaCar, FaMotorcycle } from "react-icons/fa6";

export default function Service() {
  const complaints = [
    {
      complaint_number: "CMP00003",
      created_at: "2026-05-07T15:17:34.000000Z",
      vehicle: "Honda Beat",
      license_number: "B 1652 EUD",
      queue: {
        status: "waiting",
      },
    },
    {
      complaint_number: "CMP00012",
      created_at: "2026-05-07T15:17:34.000000Z",
      vehicle: "Honda Vario",
      license_number: "B 1652 EUD",
      queue: {
        status: "done",
      },
    },
    {
      complaint_number: "CMP00001",
      created_at: "2026-05-07T15:17:34.000000Z",
      vehicle: "Yamaha Mio",
      license_number: "B 1652 EUD",
      queue: {
        status: "process",
      },
    },
    {
      complaint_number: "CMP00012",
      created_at: "2026-05-07T15:17:34.000000Z",
      vehicle: "Honda Vario",
      license_number: "B 1652 EUD",
      queue: {
        status: "done",
      },
    },
    {
      complaint_number: "CMP00001",
      created_at: "2026-05-07T15:17:34.000000Z",
      vehicle: "Yamaha Mio",
      license_number: "B 1652 EUD",
      queue: {
        status: "cancel",
      },
    },
  ];

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
      <h1>Service Dashboard</h1>
      <section className={styles.information}>
        <h2>Bintang Al Fizar</h2>
        <span>bintang25a || bintangalfizar25@gmail.com</span>
        <span>Member at: 24 Desember 2026</span>
        <span>Total Service: 80</span>

        <Link to={"/profile"}>
          <MdPerson size={40} />
        </Link>
      </section>

      <section className={styles.action}>
        <Link to={"add"}>
          <MdAssignmentAdd size={30} /> Service
        </Link>
        <Link to={"status"}>
          <MdFactCheck size={30} /> Status
        </Link>
        <Link to={"diagnosis"}>
          <MdAnalytics size={30} /> Diagnosis
        </Link>
        <Link to={"history"}>
          <MdRestore size={30} /> History
        </Link>
      </section>

      <section className={styles.history}>
        <h2>Recent History</h2>

        <div className={styles.container}>
          {complaints?.slice(0, 5)?.map((complaint) => (
            <div className={styles.card}>
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
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
