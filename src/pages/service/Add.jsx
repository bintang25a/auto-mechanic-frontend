import { useEffect, useState } from "react";
import styles from "../../styles/Service.module.css";
import { getSymptoms } from "../../_services/symptoms";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa6";
import { createComplaint } from "../../_services/complaints";

export default function Add() {
  const { setIsLoading, setInfoModal } = useOutletContext();
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const [symptomsData] = await Promise.all([getSymptoms("")]);

      setSymptoms(symptomsData?.data);
      setIsLoading(false);
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  const [formData, setFormData] = useState({});
  const [selectSymptoms, setSelectSymptoms] = useState([]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSymptomsClick = (id) => {
    const symptom = selectSymptoms?.find((s) => s == id);

    if (symptom) {
      setSelectSymptoms(selectSymptoms?.filter((s) => s != id));
    } else {
      setSelectSymptoms([...selectSymptoms, id]);
    }
  };

  const onClose = () => {
    setInfoModal({ isOpen: false });

    navigate(`/service/status`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const localUser = localStorage.getItem("user");
    const user = localUser ? JSON.parse(localUser) : {};

    const data = {
      ...formData,
      symptoms: selectSymptoms,
      customer_id: user?.uid,
    };

    try {
      const response = await createComplaint(data);
      console.log(response);

      setInfoModal({
        isOpen: true,
        title: response?.message,
        onClose,
        message:
          "Apply service successfully, Please check your service status to go to next step",
      });
    } catch (error) {
      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Get data failed",
        message: error?.message,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 250);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const filteredSymptoms = symptoms.filter((symptom) =>
    symptom?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <main className={styles.main}>
      <h1>Apply Service</h1>

      <form onSubmit={handleSubmit}>
        <section className={styles.apply}>
          <div className={styles.inputContainer}>
            <label htmlFor="vehicle">Input Motorcycle Type</label>
            <input
              type="text"
              name="vehicle"
              id="vehicle"
              placeholder="Honda Beat"
              onChange={handleFormChange}
              value={formData?.vehicle}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="license_number">Input License Number</label>
            <input
              type="text"
              name="license_number"
              id="license_number"
              placeholder="B 3241 CDE"
              onChange={handleFormChange}
              value={formData?.license_number}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="description">Input Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="Describe spesific problem"
              rows={6}
              onChange={handleFormChange}
              value={formData?.description}
            ></textarea>
          </div>
          <div className={styles.inputContainer}>
            <label>Select Symptoms</label>
            <input
              type="text"
              placeholder="Search Symptom"
              onChange={handleSearchChange}
            />

            <div className={styles.container}>
              {filteredSymptoms?.map((s) => (
                <button
                  type="button"
                  key={s?.symptom_code}
                  onClick={() => handleSymptomsClick(s?.symptom_code)}
                  className={
                    selectSymptoms?.some((sm) => sm == s?.symptom_code)
                      ? styles.selected
                      : null
                  }
                >
                  {s?.symptom_code}: {s?.name}
                </button>
              ))}
            </div>
          </div>

          <button>
            Submit Form <FaPaperPlane />
          </button>
        </section>
      </form>
    </main>
  );
}
