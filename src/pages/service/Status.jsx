import { useEffect, useState } from "react";
import styles from "../../styles/Service.module.css";
import { showComplaint } from "../../_services/complaints";
import { useOutletContext, useParams } from "react-router-dom";

export default function Status() {
  const { setIsLoading } = useOutletContext();
  const { id } = useParams();

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

      setComplaint(complaintData?.data);
      setIsLoading(false);
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  if (!complaint?.complaint_number) {
    return (
      <main className={styles.main}>
        <h1>No Data Found</h1>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>{complaint?.complaint_number}</h1>

      <section>
        <div className={styles.left}>
          <span>Name</span>
          <span>Username</span>
          <span>Vehicle</span>
          <span>Queue</span>
        </div>
        <div className={styles.right}>
          <span>: {complaint?.customer?.name}</span>
          <span>: {complaint?.customer?.id}</span>
          <span>
            : {complaint?.vehicle}-{complaint?.license_number}
          </span>
          <span>: {complaint?.queue?.queue_number}</span>
        </div>
      </section>
    </main>
  );
}
