import { useEffect, useState } from "react";
import styles from "../../styles/Service.module.css";
import { showComplaint } from "../../_services/complaints";
import { useOutletContext } from "react-router-dom";

export default function Status() {
  const { setIsLoading } = useOutletContext();

  const [complaint, setComplaint] = useState({});
  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const complaintNumber = localStorage.getItem("complaint_number");

      const [complaintData] = await Promise.all([
        showComplaint(complaintNumber),
      ]);

      setComplaint(complaintData?.data);
      setIsLoading(false);
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  return (
    <main className={styles.main}>
      <h1>{complaint?.complaint_number}</h1>
    </main>
  );
}
