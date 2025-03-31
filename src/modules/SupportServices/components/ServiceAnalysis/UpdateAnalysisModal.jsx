"use client"

import { useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"

const UpdateAnalysisModal = ({ isOpen, onClose, onUpdate, analysis }) => {
  const [analysisStatus, setAnalysisStatus] = useState("")
  const [analysisDescription, setAnalysisDescription] = useState("")
  const [analysisDate, setAnalysisDate] = useState("")
  const [laborCost, setLaborCost] = useState("")

  const handleUpdate = () => {
    onUpdate({
      ...analysis,
      status: analysisStatus,
      description: analysisDescription,
      analysisDate: analysisDate,
      laborCost: laborCost,
    })
  }

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
              <div className="form-group">
                <label htmlFor="analysisStatus">Analysis Status</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="analysisStatus"
                    value={analysisStatus}
                    onChange={(e) => setAnalysisStatus(e.target.value)}
                    placeholder="Enter analysis status"
                  />
                  <span className="select-arrow">▼</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="analysisDate">Analysis Date</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="analysisDate"
                    value={analysisDate}
                    onChange={(e) => setAnalysisDate(e.target.value)}
                    placeholder="Enter analysis date"
                  />
                  <img
                    src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                    alt="Calendar"
                    className="calendar-icon"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="analysisDescription">Analysis Description</label>
                <textarea
                  id="analysisDescription"
                  value={analysisDescription}
                  onChange={(e) => setAnalysisDescription(e.target.value)}
                  placeholder="Enter analysis description"
                  rows={5}
                />
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

