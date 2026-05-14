import { useEffect, useState } from "react";
import styles from "../../styles/Staff.module.css";
import { showComplaint } from "../../_services/complaints";
import { useOutletContext, useParams } from "react-router-dom";
import {
  MdCancel,
  MdCheckCircle,
  MdHourglassEmpty,
  MdSync,
} from "react-icons/md";
import DiagnosisItem from "../../components/items/DiagnosisItem";
import { getUsers } from "../../_services/users";
import { updateQueue } from "../../_services/queues";

export default function Show() {
  const { setIsLoading } = useOutletContext();
  const { id } = useParams();

  const [complaint, setComplaint] = useState({});
  const [queue, setQueue] = useState({});
  const [status, setStatus] = useState("waiting");
  const [mechanics, setMechanics] = useState([]);

  const [formData, setFormData] = useState({
    status: "",
    mechanic_id: "",
  });

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const complaintNumber = id
        ? id
        : localStorage.getItem("complaint_number");

      const [complaintData, usersData] = await Promise.all([
        showComplaint(complaintNumber),
        getUsers("role=mechanic"),
      ]);

      const tempComplaint = complaintData?.data;

      setComplaint(complaintData?.data);
      setQueue(tempComplaint?.queue);
      setStatus(tempComplaint?.queue?.status);
      setMechanics(usersData?.data);
      setIsLoading(false);

      setFormData({
        ...formData,
        mechanic_id: tempComplaint?.queue?.mechanic_id,
      });
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  const colorStyles = () => {
    return {
      backgroundColor:
        status === "waiting"
          ? `var(--btn-warning)`
          : status === "process"
          ? `var(--btn-info)`
          : status === "done"
          ? `var(--btn-save)`
          : `var(--btn-danger)`,
      color: `var(--platinum-gray)`,
      borderColor: `unset`,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (stat) => {
    if (!formData?.mechanic_id) {
      return alert("Select Mechanic");
    }

    const data = {
      ...formData,
      status: stat,
      _method: "PUT",
    };

    try {
      setIsLoading(true);

      await updateQueue(complaint?.queue?.id, data);

      setStatus(stat);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <span>: {complaint?.queue?.status?.toUpperCase()}</span>
        </div>
      </section>

      {queue?.mechanic_id && (
        <section className={styles.status}>
          <h2>Mechanic Profile</h2>
          <div className={styles.divider}>
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
          </div>
          <div className={styles.divider}>
            <span>: {queue?.mechanic_id}</span>
            <span>: {queue?.mechanic_name}</span>
            <span>: {queue?.mechanic_email}</span>
          </div>
        </section>
      )}

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
            <DiagnosisItem key={d?.code} d={d} styles={styles} />
          ))}
        </div>
      </section>

      <section className={styles.action}>
        <div className={styles.inputContainer}>
          <label htmlFor="mechanic_id">Select Mechanic</label>
          <select
            name="mechanic_id"
            id="mechanic_id"
            onChange={handleChange}
            value={formData?.mechanic_id}
          >
            <option value="">Select Mechanic</option>

            {mechanics?.map((m) => (
              <option key={m?.uid} value={m?.uid}>
                {m?.uid} - {m?.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className={styles.waitingColor}
          style={status === "waiting" ? colorStyles() : {}}
          onClick={() => handleSubmit("waiting")}
        >
          <MdHourglassEmpty size={30} /> Waiting
        </button>

        <button
          className={styles.processColor}
          style={status === "process" ? colorStyles() : {}}
          onClick={() => handleSubmit("process")}
        >
          <MdSync size={30} /> Process
        </button>
        <button
          className={styles.doneColor}
          style={status === "done" ? colorStyles() : {}}
          onClick={() => handleSubmit("done")}
        >
          <MdCheckCircle size={30} /> Done
        </button>
        <button
          className={styles.cancelColor}
          style={status === "cancel" ? colorStyles() : {}}
          onClick={() => handleSubmit("cancel")}
        >
          <MdCancel size={30} /> Cancel
        </button>
      </section>
    </main>
  );
}
