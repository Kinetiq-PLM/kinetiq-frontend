import { useState, useEffect } from "react";

import Button from "../../../Sales/components/Button";
import InputField from "../../../Sales/components/InputField";
import TextField from "./../TextField";
import { useAlert } from "../../../Sales/components/Context/AlertContext";
import { POST } from "../../../Sales/api/api";
import { useMutation } from "@tanstack/react-query";

const SalesTicketTab = ({
  setIsEmployeeListOpen,
  selectedEmployee,
  selectedCustomer,
  ticketInfo,
  setTicketInfo,
  setTicketID,
}) => {
  const { showAlert } = useAlert();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const ticketMutation = useMutation({
    mutationFn: async (data) => await POST("crm/ticket/", data),
    onSuccess: (data) => {
      setTicketID(data.ticket_id);
      showAlert({
        type: "success",
        message: "Ticket created successfully.",
      });
    },
    onError: (error) => {
      showAlert({
        type: "error",
        message: "An error occurred while creating a ticket: " + error.message,
      });
    },
  });

  const handleSubmit = () => {
    if (ticketInfo.priority === "") {
      showAlert({
        type: "error",
        message: "Please select a priority.",
      });
      return;
    } else if (ticketInfo.status === "") {
      showAlert({
        type: "error",
        message: "Please select a status.",
      });
      return;
    } else {
      const request = { ...ticketInfo, created_at: new Date().toISOString() };
      ticketMutation.mutate(request);
    }
  };

  useEffect(() => {
    setTicketInfo((prev) => ({ ...prev, subject: subject }));
  }, [subject]);

  useEffect(() => {
    setTicketInfo((prev) => ({ ...prev, description: description }));
  }, [description]);

  return (
    <main className="mt-4">
      <div className="text-sm flex gap-10 flex-wrap">
        <h3 className="font-bold">Create Sales Ticket</h3>
        <h3 className="opacity-50">Submit A Sales Issue</h3>
      </div>
      <div className="flex flex-col flex-wrap my-4">
        <InputField
          label={"Ticket Subject"}
          value={subject}
          setValue={setSubject}
        />

        <TextField
          label={"Description"}
          value={description}
          setValue={setDescription}
        />
      </div>

      <div className="flex mb-2 mt-4 gap-4 items-center">
        <p className="">Employee ID:</p>
        <div
          className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center h-[30px] rounded max-w-[300px]"
          onClick={() => setIsEmployeeListOpen(true)}
        >
          <p className="text-sm">
            {selectedEmployee ? selectedEmployee.employee_id : ""}
          </p>
          <img
            src="/icons/information-icon.svg"
            className="h-[15px]"
            alt="info icon"
          />
        </div>
      </div>

      <Button
        type="primary"
        onClick={handleSubmit}
        className={"mt-8"}
        disabled={
          subject && description && selectedEmployee && selectedCustomer
            ? false
            : true
        }
      >
        Submit Ticket
      </Button>
    </main>
  );
};

export default SalesTicketTab;
