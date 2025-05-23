"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Context/AlertContext.jsx";

import Table from "../../Table";
import Button from "../../Button";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../../../api/api";
import Dropdown from "../../Dropdown.jsx";
import loading from "../../Assets/kinetiq-loading.gif";

const EmployeeListModal = ({ isOpen, onClose, setEmployee }) => {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const SALES_POSITION_ID = "REG-2504-6039"; // Sales Rep position ID

  // setEmployee is used to set the selected customer in the parent component
  // setSelectedCustomer is used to set the selected customer in this component
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Filtered data is used to filter the data based on the search term
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("All"); // Default date filter
  const [employees, setEmployees] = useState([]);

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const employeeOptions = ["All", "Sales Rep"];

  const employeesQuery = useQuery({
    queryKey: ["employees"],
    queryFn: async () => await GET("misc/employee"),
    enabled: isOpen,
    retry: 2,
  });

  const columns = [
    { key: "employee_id", label: "Employee ID" },
    { key: "name", label: "Name" }, // Company Name
  ];

  const handleSearchAndFilter = () => {
    if (employeesQuery.status !== "success") return;
    console.log("Employees: ", employeesQuery.data);
    try {
      const filteredData = employeesQuery.data
        .filter((employee) => employee.name.toLowerCase().includes(searchTerm))
        .filter(
          (employee) =>
            employee.position_id.toLowerCase() ===
              SALES_POSITION_ID.toLowerCase() || employeeFilter === "All"
        );

      setFilteredData(filteredData);
    } catch (error) {
      showAlert({
        type: "error",
        title: "An error occurred while filtering the data: " + error.message,
      });
    }
  };

  const handleConfirm = () => {
    if (selectedEmployee) {
      setEmployee(selectedEmployee);
      onClose();
      showAlert({
        type: "success",
        title: "Employee Selected",
      });
      setSelectedEmployee(null);
    }
  };

  useEffect(() => {
    if (employeesQuery.status === "success") {
      setFilteredData(employeesQuery.data);
      setEmployees(employeesQuery.data);
      setIsLoading(false);
      console.log("Employees: ", employeesQuery.data);
    } else if (employeesQuery.status === "error") {
      showAlert({
        type: "error",
        title:
          "An error occurred while fetching the data: " +
          employeesQuery.error?.message,
      });
    }
  }, [employeesQuery.data, employeesQuery.status]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Focus the close button when modal opens
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    handleSearchAndFilter();
  }, [employeeFilter]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-1000"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white pb-6 overflow-auto rounded-lg shadow-lg max-w-lg w-full relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* HEADER */}
        <div className="w-full bg-[#EFF8F9] py-[20px] px-[30px] border-b border-[#cbcbcb]">
          <h2 id="modal-title" className="text-xl font-semibold">
            List of Employees
          </h2>
        </div>

        {/* Close button */}
        <button
          ref={closeButtonRef}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 rounded-full p-1 text-3xl cursor-pointer transition-all duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* BODY */}
        <div className="px-6 mt-4">
          <div className="mb-4 flex items-center gap-4">
            <p className="mr-2">Search:</p>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-2 py-1 border border-gray-300 rounded-md max-w-[300px]"
              onChange={(e) => {
                (e) => {
                  setSearchTerm(e.target.value);
                  handleSearchAndFilter();
                };
              }}
            />
            <div className="w-full sm:w-[200px]">
              <Dropdown
                options={employeeOptions}
                onChange={setEmployeeFilter}
                value={employeeFilter}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="h-[300px] rounded-md flex justify-center items-center">
              <img src={loading} alt="loading" className="h-[100px]" />
            </div>
          ) : (
            <div className="h-[300px] overflow-auto border border-[#CBCBCB] rounded-md">
              <Table
                columns={columns}
                data={filteredData}
                onSelect={setSelectedEmployee}
              />
            </div>
          )}
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                className={"mr-2"}
                onClick={handleConfirm}
                disabled={!selectedEmployee}
              >
                Select
              </Button>
            </div>
            <div>
              <Button type="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListModal;
