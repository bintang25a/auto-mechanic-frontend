import { Link, useOutletContext } from "react-router-dom";
import styles from "../../styles/Admin.module.css";
import { useEffect, useState } from "react";
import { MdVisibility } from "react-icons/md";

export default function Dashboard() {
  const { data, firstLoad, setIsLoading } = useOutletContext();

  const { complaintsData } = data;

  useEffect(() => {
    const { isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);
    }

    // eslint-disable-next-line
  }, []);

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const { setIsFirstLoad } = firstLoad;

    let conditionTimeout;

    if (complaintsData) {
      setComplaints(complaintsData?.slice(0, 5));

      conditionTimeout = setTimeout(() => {
        setIsFirstLoad(false);
        setIsLoading(false);
      }, 500);
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
  }, [complaintsData]);

  return (
    <div className={styles.dashboard}>
      <section className={styles.information}>
        <div className={styles.card}>
          <div className={styles.icon}>Icon</div>
          <div className={styles.text}>
            <span>TOTAL CUSTOMERS</span>
            <h2>
              50 <span>users</span>
            </h2>
            <span>Total pelanggan terdaftar pada database</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>Icon</div>
          <div className={styles.text}>
            <span>TOTAL QUEUES</span>
            <h2>
              12 <span>vehicles</span>
            </h2>
            <span>Total antrian hari ini</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>Icon</div>
          <div className={styles.text}>
            <span>ON WORKING</span>
            <h2>
              4 <span>vehicles</span>
            </h2>
            <span>Kendaraan yang sedang dikerjakan oleh mekanik</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>Icon</div>
          <div className={styles.text}>
            <span>HISTORY</span>
            <h2>
              150 <span>complaints</span>
            </h2>
            <span>Seluruh pelanggan yang telah selesai dikerjakan</span>
          </div>
        </div>
      </section>

      <section className={styles.divider}>
        <section className={styles.queue}>
          <h2>Waiting Queue</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Queue</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {complaints?.map((c) => (
                <tr key={c?.complaint_number}>
                  <td>{c?.complaint_number}</td>
                  <td>{c?.queue?.queue_number}</td>
                  <td>
                    {c?.customer?.name} - {c?.customer?.uid}
                  </td>
                  <td>
                    {c?.vehicle} - {c?.license_number}
                  </td>
                  <td>
                    <Link>
                      <MdVisibility />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
      <section className={styles.divider}></section>
    </div>
  );
}
