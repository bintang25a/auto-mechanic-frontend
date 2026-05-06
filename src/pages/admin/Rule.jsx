import { useEffect, useState } from "react";
import { MdAddBox, MdSearch } from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";
import { createRule, deleteRule, getRules } from "../../_services/rules";
import { showSymptom } from "../../_services/symptoms";
import { showDamage } from "../../_services/damages";
import styles from "../../styles/Admin.module.css";

export default function Rule() {
  const { setIsLoading, setInfoModal, refresh } = useOutletContext();

  const [damages, setDamages] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [rules, setRules] = useState([]);
  const [search, setSearch] = useState({
    key: "",
    value: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [rulesData] = await Promise.all([getRules()]);

      setRules(rulesData?.data);
      setDamages([
        ...new Set(rulesData?.data?.map((item) => item.damage_code)),
      ]);
      setSymptoms([
        ...new Set(rulesData?.data?.map((item) => item.symptom_code)),
      ]);

      setTimeout(() => setIsLoading(false), 250);
    };

    fetchData();
    // eslint-disable-next-line
  }, [refresh]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearch({
      ...search,
      [name]: value
    });
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState({});

  const symptomFields = [
    {
      name: "symptom_code",
      label: "Symptom Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "damages",
      label: "Possible damages code",
      type: "text",
    },
  ];

  const damageFields = [
    {
      name: "damage_code",
      label: "Damage Code",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "symptoms",
      label: "Symptoms code possible",
      type: "text",
    },
  ];

  const handleFetchData = async (id, isDamage) => {
    setIsLoading(true);

    try {
      const response = isDamage ? await showDamage(id) : await showSymptom(id);
      const data = response?.data;
      const symptomsData = response?.data?.symptoms;
      const damagesData = response?.data?.damages;

      setViewModal({
        fields: isDamage ? damageFields : symptomFields,
        data: isDamage
          ? {
              ...data,
              symptoms: symptomsData?.map((d) => d.symptom_code).join(", "),
            }
          : {
              ...data,
              damages: damagesData?.map((d) => d.damage_code).join(", "),
            },
      });
    } catch (error) {
      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Get data failed",
        message: error?.message,
      });
    } finally {
      setIsLoading(false);
    }

    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const isMatching = (sCode, dCode) => {
    const exist = rules?.some(
      (rule) => rule?.symptom_code === sCode && rule?.damage_code === dCode
    );

    return exist ? "X" : "";
  };

  const handleToggleRule = async (sCode, dCode) => {
    const rule = rules?.find(
      (rule) => rule?.symptom_code === sCode && rule?.damage_code === dCode
    );

    try {
      if (rule) {
        await deleteRule(rule?.id);

        setRules(rules?.filter((r) => r?.id !== rule?.id));
      } else {
        const response = await createRule({
          symptom_code: sCode,
          damage_code: dCode,
        });

        setRules([
          ...rules,
          { id: response?.data?.id, symptom_code: sCode, damage_code: dCode },
        ]);
      }
    } catch (error) {
      console.error(error?.response?.message);

      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Create data failed",
        message: error?.message,
      });
    }
  };

  const handleSearch = () => {
    const temp = {
      damages: damages?.filter((d) => d?.includes(search)),
      symptoms: symptoms?.filter((d) => d?.includes(search)),
    };

    setDamages(temp?.damages);
    setSymptoms(temp?.symptoms);

    console.log(temp);
  };

  return (
    <div className={styles.userPage}>
      <header className={styles.header}>
        <h2>Rules Data</h2>

        <form>
          <div className={styles.search}>
            <select name="key" onChange={handleSearchChange}>
              <option value="damages">Damages</option>
              <option value="symptoms">Symptoms</option>
            </select>

            <input
              type="text"
              name="value"
              id="value"
              placeholder="Search data"
              onChange={handleSearchChange}
              value={search?.value}
            />

            <button type="button" title="Search" onClick={handleSearch}>
              <MdSearch />
            </button>
          </div>
        </form>
      </header>

      <main className={styles.main}>
        <div className={styles.tableContainer}>
          <table className={styles.rulesTable}>
            <thead>
              <tr>
                <th>Key</th>
                {damages?.map((damage, i) => (
                  <th key={i} onClick={() => handleFetchData(damage, true)}>
                    {damage}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {symptoms?.map((symptom, i) => (
                <tr key={i}>
                  <td onClick={() => handleFetchData(symptom)}>{symptom}</td>
                  {damages?.map((damage, i) => (
                    <td
                      key={i}
                      title="Double click to mark"
                      onDoubleClick={() => handleToggleRule(symptom, damage)}
                    >
                      {isMatching(symptom, damage)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className={styles.footer}>
        <button disabled>Prev Page</button>
        <span>Page 1</span>
        <button disabled>Next Page</button>
      </footer>

      {modalOpen && (
        <FormModal
          fields={viewModal?.fields}
          data={viewModal?.data}
          onClose={handleModalClose}
          onSubmit={() => {}}
          isView={true}
        />
      )}
    </div>
  );
}
