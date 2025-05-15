import { useState, useEffect } from "react";

import Button from "../../../Sales/components/Button";
import InputField from "../../../Sales/components/InputField";
import TextField from "./../TextField";
import { useAlert } from "../../../Sales/components/Context/AlertContext";
import { POST, GET } from "../../../Sales/api/api";
import { useMutation } from "@tanstack/react-query";

const ServiceTicketTab = ({
  setIsEmployeeListOpen,
  selectedCustomer,
  ticketInfo,
  setTicketInfo,
  setTicketID,
  employee_id,
}) => {
  const { showAlert } = useAlert();
  const [btnDisabled, setBtnDisabled] = useState(false);
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

  useEffect(() => {
    (async () => {
      try {
        const res = await GET(`misc/employee/${employee_id}`);
        if (
          ![
            "REG-2504-d389",
            "REG-2504-ba0c",
            "REG-2504-ed23",
            "REG-2504-8f19",
            "REG-2504-81ab",
            "REG-2504-b330",
          ].includes(res.position_id)
        ) {
          setBtnDisabled(true);
        }
      } catch (err) {
        showAlert({
          type: "error",
          title: "An error occurred while fetching employee data.",
        });
      }
    })();
  }, []);
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
      const request = {
        ...ticketInfo,
        type: "Service",
        created_at: new Date().toISOString(),
      };
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
        <h3 className="font-bold">Create Ticket Issue</h3>
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
          className="border border-[#9a9a9a] flex-1 p-1 flex transition-all duration-300 justify-between transform items-center h-[30px] rounded max-w-[300px]"
          onClick={() => setIsEmployeeListOpen(true)}
        >
          <p className="text-sm">{ticketInfo.salesrep || ""}</p>
        </div>
      </div>

      <Button
        type="primary"
        onClick={handleSubmit}
        className={"mt-8"}
        disabled={
          (subject && description && selectedCustomer ? false : true) ||
          btnDisabled
        }
      >
        Send To Services
      </Button>
    </main>
  );
};

export default ServiceTicketTab;
