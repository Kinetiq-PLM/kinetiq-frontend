import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditDepartment.css";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("departmentsList") || "[]");
    const dept = list.find((d) => d.id === id);
    if (dept) {
      setFormData({ ...dept });
    } else {
      setFormData(null);
    }
  }, [id]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    const list = JSON.parse(localStorage.getItem("departmentsList") || "[]");
    const updated = list.map((d) =>
      d.id === id ? { ...d, name: formData.name } : d
    );
    localStorage.setItem("departmentsList", JSON.stringify(updated));
    navigate("/departments");
  };

  const handleCancel = () => {
    navigate("/departments");
  };

  const handleArchive = () => {
    const list = JSON.parse(localStorage.getItem("departmentsList") || "[]");
    const updated = list.filter((d) => d.id !== id);
    localStorage.setItem("departmentsList", JSON.stringify(updated));
    navigate("/departments");
  };

  if (!formData) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        Department not found or may have been removed.
      </div>
    );
  }

  return (
    <div className="hr-edit-dept-page">
      <div className="hr-edit-dept-container">
        <div className="hr-edit-dept-scrollable">
          <div className="hr-edit-dept-header">
            <h2>Edit Department: {formData.id}</h2>
          </div>
          <form className="hr-edit-dept-form">
            <label>
              Department ID:
              <input type="text" value={formData.id} readOnly />
            </label>
            <label>
              Department Name:
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </label>
          </form>
          <div className="hr-edit-dept-buttons">
            <button onClick={handleCancel} className="hr-edit-dept-cancel">Cancel</button>
            <button onClick={handleArchive} className="hr-edit-dept-archive">Archive</button>
            <button onClick={handleSave} className="hr-edit-dept-save">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
