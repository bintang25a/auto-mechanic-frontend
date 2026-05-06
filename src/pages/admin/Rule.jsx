import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import FormModal from "../../components/overlay/FormModal";
import { createRule, deleteRule } from "../../_services/rules";
import { showSymptom } from "../../_services/symptoms";
import { showDamage } from "../../_services/damages";
import { adminPageRules } from "../../_services/page";
import styles from "../../styles/Admin.module.css";

export default function Rule() {
  const { setIsLoading, setInfoModal, refresh } = useOutletContext();

  const [rules, setRules] = useState([]);
  const [search, setSearch] = useState("");
  const [rowCol, setRowCol] = useState({
    row: [],
    col: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [rulesData] = await Promise.all([adminPageRules()]);
      console.log(rulesData);

      setRules(rulesData?.rules);

      setRowCol({
        row: [...(rulesData?.symptoms || [])].sort((a, b) => {
          return a?.symptom_code?.localeCompare(b?.symptom_code, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }),

        col: [...(rulesData?.damages || [])].sort((a, b) => {
          return a?.damage_code?.localeCompare(b?.damage_code, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }),
      });

      setTimeout(() => setIsLoading(false), 250);
    };

    fetchData();
    // eslint-disable-next-line
  }, [refresh]);

  const handleSearchChange = (e) => {
    const { value } = e.target;

    setSearch(value);
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

  return (
    <div className={styles.userPage}>
      <header className={styles.header}>
        <h2>Rules Data</h2>

        <form>
          <div className={styles.search}>
            <select disabled>
              <option value="">Click Damage/Symptom Code to see detail</option>
            </select>

            <input
              type="text"
              name="value"
              id="value"
              placeholder="Search data"
              onChange={handleSearchChange}
              value={search}
            />
          </div>
        </form>
      </header>

      <main className={styles.main}>
        <div className={styles.tableContainer}>
          <table className={styles.rulesTable}>
            <thead>
              <tr>
                <th>Key</th>
                {rowCol?.col?.map((damage, i) => (
                  <th
                    key={i}
                    onClick={() => handleFetchData(damage?.damage_code, true)}
                  >
                    {damage?.damage_code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowCol?.row?.map((symptom, i) => (
                <tr key={i}>
                  <td onClick={() => handleFetchData(symptom?.symptom_code)}>
                    {symptom?.symptom_code}
                  </td>
                  {rowCol?.col?.map((damage, i) => (
                    <td
                      key={i}
                      title={`Double click to mark \nG: ${symptom?.name} \nK: ${damage?.name}`}
                      onDoubleClick={() =>
                        handleToggleRule(
                          symptom?.symptom_code,
                          damage?.damage_code
                        )
                      }
                      className={
                        (symptom?.symptom_code
                          ?.toLowerCase()
                          .includes(search?.toLowerCase()) ||
                          damage?.damage_code
                            ?.toLowerCase()
                            .includes(search?.toLowerCase())) &&
                        search
                          ? styles.search
                          : null
                      }
                    >
                      {isMatching(symptom?.symptom_code, damage?.damage_code)}
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
