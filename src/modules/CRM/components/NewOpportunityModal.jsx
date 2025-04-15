"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Sales/components/Context/AlertContext.jsx";

import Button from "../../Sales/components/Button.jsx";
import InputField from "../../Sales/components/InputField.jsx";
import DateInputField from "../../Sales/components/DateInputField.jsx";
import Dropdown from "../../Sales/components/Dropdown.jsx";
import Dropup from "../../Sales/components/Dropup.jsx";
import TextField from "./TextField.jsx";

import { POST } from "../../Sales/api/api.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NumberInputField from "../../Sales/components/NumberInputField.jsx";

const NewOpportunityModal = ({
  isOpen,
  onClose,
  setCanSave,
  selectedCustomer,
  employee_id,
}) => {
  const { showAlert } = useAlert();

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // ========== DATA ==========
  const stages = ["Prospecting", "Negotiation", "Closed"];
  const statuses = ["Open", "Won", "Lost"];
  const interestLevels = ["Very High", "High", "Medium", "Low"];
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [lostReason, setLostReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stage, setStage] = useState("");
  const [status, setStatus] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [weightedAmount, setWeightedAmount] = useState("");
  const [grossProfit, setGrossProfit] = useState("");
  const [grossProfitTotal, setGrossProfitTotal] = useState("");
  const [interestLevel, setInterestLevel] = useState("");
  const opportunityMutation = useMutation({
    mutationFn: async (data) => await POST(`crm/opportunities/`, data),
    onSuccess: (data) => {
      queryClient.refetchQueries(["customerOpps"]);
      showAlert({
        type: "success",
        title: "Opportunity created.",
      });
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "An error occurred while creating opportunity: " + error.message,
      });
    },
  });
  // ========== DATA ==========

  const [isValidationVisible, setIsValidationVisible] = useState(false);

  const handleConfirm = () => {
    const validators = [
      validateDescription,
      validateStage,
      validateStartDate,
      validateEndDate,
      validateStatus,
      validateEstimatedValue,
      validateWeightedAmount,
      validateGrossProfit,
      // validateGrossProfitTotal,
      validateLevelOfInterest,
    ];

    if (status === "Lost") {
      validators.push(validateReason);
    }

    const errorCount = validators.reduce(
      (count, validate) => count + (validate() ? 1 : 0),
      0
    );

    if (errorCount === 0) {
      // Reset form fields
      const request = {
        customer: selectedCustomer.customer_id,
        partner: selectedCustomer.partner.partner_id,
        salesrep: employee_id,
        starting_date: startDate,
        expected_closed_date: endDate,
        estimated_value: estimatedValue,
        weighted_amount: weightedAmount,
        gross_profit_percentage: grossProfit,
        gross_profit_total: grossProfitTotal,
        stage,
        status,
        description,
        interest_level: interestLevel,
      };

      console.log(request);
      opportunityMutation.mutate(request);
      setDescription("");
      setStartDate("");
      setEndDate("");
      setStage("");
      setStatus("");
      setEstimatedValue("");
      setWeightedAmount("");
      setGrossProfit("");
      setGrossProfitTotal("");
      setInterestLevel("");
      setIsValidationVisible(false);
      setCanSave(true);
      onClose();
    } else {
      setIsValidationVisible(true);
      showAlert({
        type: "error",
        title: "Please complete the form correctly.",
      });
    }
  };

  const validateDescription = () => {
    if (!description.trim()) {
      return "Description is required.";
    }
    return "";
  };

  const validateStage = () => {
    if (!stage.trim()) {
      return "Stage Type is required.";
    } else if (status === "Lost" && stage !== "Closed") {
      return "Stage must be Closed when status is Lost.";
    }
    return "";
  };

  const validateStatus = () => {
    if (!status.trim()) {
      return "Status Type is required.";
    }
    return "";
  };

  const validateEstimatedValue = () => {
    if (!estimatedValue.trim()) {
      return "Estimated Value is required.";
    }
    return "";
  };
  const validateWeightedAmount = () => {
    if (!weightedAmount.trim()) {
      return "Weighted Amount is required.";
    }
    return "";
  };
  const validateGrossProfit = () => {
    if (!grossProfit.trim()) {
      return "Gross Profit is required.";
    }
    return "";
  };

  // const validateGrossProfitTotal = () => {
  //   if (!grossProfitTotal.trim()) {
  //     return "Gross Profit Total is required.";
  //   }
  //   return "";
  // };

  const validateLevelOfInterest = () => {
    if (!interestLevel.trim()) {
      return "Level of Interest is required.";
    }
    return "";
  };

  const validateStartDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    if (!startDate.trim()) {
      return "Start date is required.";
    }

    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return "Invalid start date format.";
    }

    return "";
  };

  const validateEndDate = () => {
    if (!endDate.trim()) {
      return "End date is required.";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(end.getTime())) {
      return "Invalid end date format.";
    }

    if (end < start) {
      return "End date cannot be earlier than start date.";
    }

    return "";
  };

  const validateReason = () => {
    if (!lostReason.trim()) {
      return "Reason is required.";
    }
    return "";
  };

  useEffect(() => {
    if (status === "Lost") {
      setStage("Closed");
    } else {
      setLostReason("");
    }
  }, [status]);

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
    setDescription("");
    setStartDate("");
    setEndDate("");
    setStage("");
    setStatus("");
    setLostReason("");
    setGrossProfit("");
    setEstimatedValue("");
    setWeightedAmount("");
    setGrossProfitTotal("");
    setInterestLevel("");
    setIsValidationVisible(false);
  }, [isOpen]);

  useEffect(() => {
    setGrossProfitTotal(Number(estimatedValue) * (Number(grossProfit) / 100));
  }, [grossProfit, estimatedValue]);
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
        className="bg-white pb-6 my-6 overflow-auto rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* HEADER */}
        <div className="w-full bg-[#EFF8F9] py-[20px] px-[30px] border-b border-[#cbcbcb]">
          <h2 id="modal-title" className="text-xl font-semibold">
            Create Opportunity
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
          <form action="" className="space-y-4 mb-6">
            <InputField
              label={"Description"}
              value={description}
              setValue={setDescription}
              validation={validateDescription}
              isValidationVisible={isValidationVisible}
            />
            <div className="flex gap-2">
              <DateInputField
                label={"Start Date"}
                value={startDate}
                setValue={setStartDate}
                validation={validateStartDate}
                isValidationVisible={isValidationVisible}
              />
              <DateInputField
                label={"End Date"}
                value={endDate}
                setValue={setEndDate}
                validation={validateEndDate}
                isValidationVisible={isValidationVisible}
              />
            </div>

            <div className="flex gap-2">
              <Dropdown
                label="Stage"
                options={stages}
                onChange={setStage}
                value={stage}
                validation={validateStage}
                isValidationVisible={isValidationVisible}
              />
              <Dropdown
                label="Status"
                options={statuses}
                onChange={setStatus}
                value={status}
                validation={validateStatus}
                isValidationVisible={isValidationVisible}
              />
            </div>
            {status === "Lost" ? (
              <TextField
                label={"Reason Lost"}
                value={lostReason}
                setValue={setLostReason}
                validation={validateReason}
                isValidationVisible={isValidationVisible}
              />
            ) : null}

            <div className="flex gap-2">
              <NumberInputField
                label={"Estimated Value"}
                value={estimatedValue}
                setValue={setEstimatedValue}
                validation={validateEstimatedValue}
                isValidationVisible={isValidationVisible}
              />
              <NumberInputField
                label={"Weighted Amount"}
                value={weightedAmount}
                setValue={setWeightedAmount}
                validation={validateWeightedAmount}
                isValidationVisible={isValidationVisible}
              />
            </div>
            <div className="flex gap-2">
              <NumberInputField
                label={"Gross Profit %"}
                value={grossProfit}
                setValue={setGrossProfit}
                validation={validateGrossProfit}
                isValidationVisible={isValidationVisible}
                isPercent={true}
              />
              <NumberInputField
                label={"Gross Profit Total"}
                value={grossProfitTotal}
                disabled={true}
              />
            </div>
            <Dropup
              label="Level of Interest"
              options={interestLevels}
              onChange={setInterestLevel}
              value={interestLevel}
              validation={validateLevelOfInterest}
              isValidationVisible={isValidationVisible}
            />
          </form>

          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                className={"mr-2"}
                onClick={handleConfirm}
                submit={true}
              >
                Create
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

export default NewOpportunityModal;
