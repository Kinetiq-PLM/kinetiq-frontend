"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Sales/components/Context/AlertContext.jsx";

import Button from "../../Sales/components/Button.jsx";
import InputField from "../../Sales/components/InputField.jsx";
import TextField from "./TextField.jsx";
import { PATCH, POST } from "../../Sales/api/api.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const TicketResolve = ({ isOpen, onClose, ticket, setIsTicketDetailOpen }) => {
  const { showAlert } = useAlert();

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isValidationVisible, setIsValidationVisible] = useState(false);
  const queryClient = useQueryClient();
  const ticketMutation = useMutation({
    mutationFn: async (data) => await POST("crm/ticket-convo/", data),
    onSuccess: async (data) => {
      await PATCH(`crm/ticket/${ticket.ticket_id}/`, {
        status: "Closed",
      });
      queryClient.refetchQueries(["tickets"]);
      showAlert({
        type: "success",
        title: "Ticket resolved.",
      });
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "An error occurred while resolving ticket: " + error.message,
      });
    },
  });
  const handleConfirm = () => {
    const validators = [validateMessage, validateSubject];

    const errorCount = validators.reduce(
      (count, validate) => count + (validate() ? 1 : 0),
      0
    );
    setIsValidationVisible(true);
    if (errorCount === 0) {
      // Resolve ticket here
      const request = {
        ticket: ticket.ticket_id,
        subject,
        content: message,
      };
      ticketMutation.mutate(request);
      // Reset form fields
      setSubject("");
      setMessage("");
      setIsValidationVisible(false);

      onClose();
      setIsTicketDetailOpen(false);
    } else {
      showAlert({
        type: "error",
        title: "Please complete the form correctly.",
      });
    }
  };

  const validateSubject = () => {
    if (!subject.trim()) {
      return "Subject is required.";
    }
    return "";
  };

  const validateMessage = () => {
    if (!message.trim()) {
      return "Message is required.";
    }
    return "";
  };

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
            Ticket Response
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
            <div className="flex gap-2">
              <InputField
                label={"Ticket ID"}
                value={ticket.ticket_id}
                isDisabled={true}
              />
              <InputField
                label={"Customer ID"}
                value={ticket.customer_id}
                isDisabled={true}
              />
            </div>
            <InputField
              label={"Reply Subject"}
              value={subject}
              setValue={setSubject}
              validation={validateSubject}
              isValidationVisible={isValidationVisible}
            />
            <TextField
              label={"Reply Message"}
              value={message}
              setValue={setMessage}
              validation={validateMessage}
              isValidationVisible={isValidationVisible}
            />
          </form>

          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                className={"mr-2"}
                submit={true}
                onClick={handleConfirm}
              >
                Submit
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

export default TicketResolve;
