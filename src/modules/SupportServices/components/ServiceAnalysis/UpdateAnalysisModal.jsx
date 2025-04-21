"use client"

import { useRef, useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"

const UpdateAnalysisModal = ({ isOpen, onClose, onUpdate, analysis }) => {
  const [analysisStatus, setAnalysisStatus] = useState("")
  const [analysisDescription, setAnalysisDescription] = useState("")
  const [analysisDate, setAnalysisDate] = useState("")
  const [laborCost, setLaborCost] = useState("0.00")
  const [isOpenStatusDD, setOpenStatusDD] = useState(false);


  useEffect(() => {
    if (analysis) {
      console.log("asdasd", analysis)
      // Reset all fields to empty to show placeholders
      setAnalysisStatus(analysis.analysis_status || "");
      setAnalysisDate(analysis.analysis_date || "");
      setLaborCost(analysis.labor_cost || "");
      setAnalysisDescription(analysis.analysis_description || "");
    }
  }, [analysis])

  // handle status
  const handleStatusDropdown = () => {
    setOpenStatusDD((prev) => !prev); 
  };

  const handleSelectStatus = (selectedStatus) => {
    setAnalysisStatus(selectedStatus); 
    setOpenStatusDD(false); 
  };

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const toggleDatePicker = () => {
    const dateInput = document.getElementById("analysisDate");
    if (isPickerOpen) {
      dateInput.blur(); 
    } else {
      dateInput.showPicker(); 
    }
    
    setIsPickerOpen(!isPickerOpen); 
  };

  const handleUpdate = () => {
    onUpdate({
      analysis_id: analysis.analysis_id,
      analysis_status: analysisStatus,
      analysis_description: analysisDescription,
      analysis_date: analysisDate,
      labor_cost: laborCost,
    })
    setAnalysisStatus("");
    setAnalysisDate("");
    setLaborCost("");
    setAnalysisDescription("");
  }

  const statusRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setOpenStatusDD(false); // Close the dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container update-analysis-modal">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img
              src={ServiceAnalysisIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Analysis"
              className="modal-header-icon"
            />
            <h2>Update Service Analysis</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=20&width=20"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="analysisStatus">Analysis Status</label>
                <div className="select-wrapper" ref={statusRef}>
                  <input
                    type="text"
                    id="analysisStatus"
                    value={analysisStatus}
                    readOnly
                    onChange={(e) => setAnalysisStatus(e.target.value)}
                    placeholder="Enter analysis status"
                  />
                  <span className="select-arrow" onClick={handleStatusDropdown}>▼</span>
                  {isOpenStatusDD && (
                    <ul className="dropdown-list">
                      {["Scheduled", "Done"].map((status) => (
                        <li key={status} onClick={() => handleSelectStatus(status)}>
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>


              <div className="form-group">
                <label htmlFor="analysisDate">Analysis Date</label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    id="analysisDate"
                    value={analysisDate}
                    onChange={(e) => setAnalysisDate(e.target.value)}
                    placeholder="Enter analysis date"
                  />
                  <img
                    src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                    alt="Calendar"
                    className="calendar-icon"
                    onClick={toggleDatePicker}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="laborCost">Labor Cost</label>
                <input
                  type="text"
                  id="laborCost"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  placeholder="Enter labor cost"
                />
              </div>
            </div>

              <div className="form-group">
                <label htmlFor="analysisDescription">Analysis Description</label>
                <div className="textarea-container">
                  <textarea
                    id="analysisDescription"
                    value={analysisDescription}
                    onChange={(e) => setAnalysisDescription(e.target.value)}
                    placeholder="Enter analysis description"
                  />
                </div>
                
              </div>
          </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="update-modal-button" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateAnalysisModal

