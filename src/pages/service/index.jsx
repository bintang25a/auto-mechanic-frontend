import {
  MdAnalytics,
  MdAssignmentAdd,
  MdFactCheck,
  MdPerson,
  MdRestore,
} from "react-icons/md";
import styles from "../../styles/Service.module.css";
import { Link } from "react-router-dom";

export default function Service() {
  return (
    <main className={styles.main}>
      <h1>Dashboard</h1>
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
        <Link>
          <MdAssignmentAdd size={30} /> Apply
        </Link>
        <Link>
          <MdFactCheck size={30} /> Status
        </Link>
        <Link>
          <MdAnalytics size={30} /> Diagnosis
        </Link>
        <Link>
          <MdRestore size={30} /> History
        </Link>
      </section>
      <section className={styles.history}>Top 5 History</section>
    </main>
  );
}
