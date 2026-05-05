import { useState } from "react";
import styles from "../../styles/Component.module.css";
import { MdClose, MdSend } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa6";

export default function FormModal({ fields, onSubmit, onClose }) {
  const [formData, setFormData] = useState(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
  });

  const handleChange = (e) => {
    const { value, name, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];

      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles?.formModal}`}>
        <h2>Add Data</h2>

        <form onSubmit={(e) => onSubmit(e, formData)}>
          <div className={styles.formContainer}>
            {fields?.map((field, i) => (
              <div key={i} className={styles?.inputContainer}>
                {field?.type === "select" ? (
                  <>
                    <label htmlFor={field?.name}>{field?.label}</label>
                    <select
                      name={field?.name}
                      id={field?.name}
                      onChange={handleChange}
                      value={formData[field?.name]}
                      required
                    >
                      <option value="">{field?.label}</option>
                      {field?.options?.map((option, i) => (
                        <option key={i} value={option?.value}>
                          {option?.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label htmlFor={field?.name}>{field?.label}</label>
                    <input
                      type={field?.type}
                      name={field?.name}
                      id={field?.name}
                      onChange={handleChange}
                      value={formData[field?.name]}
                      required={field?.type !== "file"}
                    />
                  </>
                )}
              </div>
            ))}

            <button type="submit">
              Submit <FaPaperPlane />
            </button>
          </div>
        </form>

        <button onClick={onClose}>
          <MdClose />
        </button>
      </div>
    </div>
  );
}
