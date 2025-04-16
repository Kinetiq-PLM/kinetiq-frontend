import React, { useState, useEffect } from 'react';
import { approvalService } from '../components/Approvals/API.jsx';
import "../styles/ManagementApprovals.css";

function Approvals() {
  const [formData, setFormData] = useState({
    approvalId: '',
    requestId: '',
    decisionDate: '',
    externalId: '',
    issueDate: '',
    checkedBy: '',
    dueDate: '',
    checkedDate: '',
    remarks: '',
    status: ''
  });

  const handleSave = async () => {
    try {
      // Map frontend data to backend structure
      const backendData = {
        approval_id: formData.approvalId,
        request_id_all: formData.requestId,
        external_id: formData.externalId,
        decision_date: formData.decisionDate,
        issue_date: formData.issueDate,
        checked_by: formData.checkedBy,
        checked_date: formData.checkedDate,
        due_date: formData.dueDate,
        remarks: formData.remarks,
        status: formData.status
      };

      if (formData.approvalId) {
        await approvalService.update(formData.approvalId, backendData);
      } else {
        await approvalService.create(backendData);
      }

      // Reset form
      setFormData({
        approvalId: '',
        requestId: '',
        decisionDate: '',
        externalId: '',
        issueDate: '',
        checkedBy: '',
        dueDate: '',
        checkedDate: '',
        remarks: '',
        status: ''
      });
    } catch (error) {
      console.error('Error saving approval:', error);
    }
  };

  const handleSearchIdChange = async (event) => {
    const value = event.target.value;
    try {
      const data = await approvalService.fetchAll();
      const filteredData = data.filter(item => 
        item.approval_id.toLowerCase().includes(value.toLowerCase())
      );
      setApprovalList(filteredData.map(item => ({
        approvalId: item.approval_id,
        requestId: item.request_id_all,
        externalId: item.external_id,
        issueDate: item.issue_date,
        checkedBy: item.checked_by,
        checkedDate: item.checked_date,
        status: item.status,
        dueDate: item.due_date,
        remarks: item.remarks
      })));
    } catch (error) {
      console.error('Error searching approvals:', error);
    }
  };

  // ...rest of your component remains the same
}