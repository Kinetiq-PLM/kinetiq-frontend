import { useEffect, useState } from "react";
import Table from "../../../Sales/components/Table";
import Button from "../../../Sales/components/Button";

import CampaignListModal from "./../CampaignListModal";
import CustomerListModal from "./../../../Sales/components/Modals/Lists/CustomerList";
import NewCustomerModal from "./../../../Sales/components/Modals/NewCustomer";
import { useAlert } from "../../../Sales/components/Context/AlertContext.jsx";
import { DELETE, GET, PATCH } from "../../../Sales/api/api.jsx";
import EmployeeListModal from "../../../Sales/components/Modals/Lists/EmployeeListModal.jsx";
import OpportunityInfo from "./../OpportunityInfo";
import NewOpportunityModal from "./../NewOpportunityModal";
import OpportunityModal from "../OpportunityModal.jsx";
import ConfirmDelete from "./../ConfirmDelete";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InputCustomer } from "./../OpportunityInfo";

export default function MainTab({ employee_id }) {
  const { showAlert } = useAlert();

  const [canSave, setCanSave] = useState(false); // Save button state

  const [opportunityList, setOpportunityList] = useState([]); // Customers part of the campaign

  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isNewOpportunityModalOpen, setIsNewOpportunityModalOpen] =
    useState(false);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Confirm delete modal state
  const [isConfirmedDelete, setIsConfirmedDelete] = useState(false); // Confirm delete state

  const [selectedOpportunity, setSelectedOpportunity] = useState(""); // table data that is selected
  const [selectedCustomer, setSelectedCustomer] = useState(""); // customer selected from modal
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const customerOppQuery = useQuery({
    queryKey: ["customerOpps"],
    queryFn: async () =>
      await GET(
        `crm/opportunities?customer=${selectedCustomer.customer_id}&salesrep=${employee_id}`
      ),
    retry: 2,
  });

  const deleteOppMutation = useMutation({
    mutationFn: async (data) =>
      await PATCH(`crm/opportunities/${data.opportunity_id}/`, {
        is_archived: true,
      }),
    onSuccess: (data) => {
      showAlert({
        type: "success",
        title: "Opportunity removed.",
      });
      customerOppQuery.refetch();
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "An error occurred while removing opportunity: " + error.message,
      });
    },
  });
  const columns = [
    { key: "opportunity_id", label: "Opportunity ID" },
    { key: "description", label: "Description" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "stage", label: "Stage" },
    { key: "status", label: "Status" },
    { key: "estimated_value", label: "Estimated Value" },
    { key: "gross_profit_total", label: "Gross Profit" },
    { key: "interest_level", label: "Interest Level" },
    { key: "reason_lost", label: "Reason Lost" },
  ];

  useEffect(() => {
    customerOppQuery.refetch();
  }, [selectedCustomer]);

  useEffect(() => {
    if (customerOppQuery.status === "success") {
      const data = customerOppQuery.data.map((opp) => ({
        ...opp,
        opportunity_id: opp.opportunity_id,
        description: opp.description,
        start_date: new Date(opp.starting_date).toLocaleDateString(),
        end_date: new Date(opp.expected_closed_date).toLocaleDateString(),
        stage: opp.stage,
        status: opp.status,
        estimated_value: Number(opp.estimated_value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        gross_profit_total: Number(opp.gross_profit_total).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
        interest_level: opp.interest_level,
        reason_lost: opp.reason_lost || "-",
      }));
      setOpportunityList(data);
    } else if (customerOppQuery.status === "error") {
      showAlert({
        type: "error",
        title:
          "An error occurred while fetching data: " +
          customerOppQuery.error.message,
      });
    }
  }, [customerOppQuery.data, customerOppQuery.status]);

  const handleDelete = async () => {
    if (selectedOpportunity === "") {
      showAlert({
        type: "error",
        title: "Select an opportunity to remove.",
      });
      return;
    }

    // setOpportunityList(
    //   opportunityList.filter(
    //     //(opportunity) => opportunity.opportunity_id != selectedOpportunity.opportunity_id
    //     (opportunity) =>
    //       opportunity.customer_id != selectedOpportunity.customer_id
    //   )
    // );
    deleteOppMutation.mutate({
      opportunity_id: selectedOpportunity.opportunity_id,
    });
    setSelectedOpportunity("");

    setCanSave(true);
    setIsConfirmedDelete(false);
  };

  useEffect(() => {
    setSelectedEmployee(selectedOpportunity.salesrep);
  }, [selectedOpportunity]);

  return (
    <section className="h-full">
      {/* Header Section */}
      <div className="flexflex-col justify-between mb-4 flex-wrap gap-4">
        <CustomerListModal
          isOpen={isCustomerListOpen}
          onClose={() => setIsCustomerListOpen(false)}
          isNewCustomerModalOpen={isNewCustomerModalOpen}
          newCustomerModal={setIsNewCustomerModalOpen}
          setCustomer={setSelectedCustomer}
        ></CustomerListModal>

        <NewCustomerModal
          isOpen={isNewCustomerModalOpen}
          onClose={() => setIsNewCustomerModalOpen(false)}
        ></NewCustomerModal>

        {/* <EmployeeListModal
          isOpen={isEmployeeListOpen}
          onClose={() => setIsEmployeeListOpen(false)}
          setEmployee={setSelectedEmployee}
        ></EmployeeListModal> */}

        {/** Opportunity edit */}
        <OpportunityModal
          isOpen={isOpportunityModalOpen}
          onClose={() => setIsOpportunityModalOpen(false)}
          setCanSave={setCanSave}
          selectedCustomer={selectedCustomer}
          selectedEmployee={selectedEmployee}
          details={selectedOpportunity}
        ></OpportunityModal>

        <NewOpportunityModal
          isOpen={isNewOpportunityModalOpen}
          onClose={() => setIsNewOpportunityModalOpen(false)}
          setCanSave={setCanSave}
          selectedCustomer={selectedCustomer}
          employee_id={employee_id}
        ></NewOpportunityModal>

        <ConfirmDelete
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          handleDelete={handleDelete}
        ></ConfirmDelete>

        <div>
          <OpportunityInfo
            customerListModal={setIsCustomerListOpen}
            customer={selectedCustomer}
            employeeListModal={setIsEmployeeListOpen}
            employee={selectedEmployee}
          ></OpportunityInfo>
        </div>
        <div className="border border-[#CBCBCB] w-full min-h-[350px] rounded-md mt-2 table-layout overflow-auto">
          <Table
            onSelect={setSelectedOpportunity}
            data={opportunityList}
            columns={columns}
          />
        </div>
        <section className="mt-4 flex justify-end flex-col lg:flex-row space-x-4">
          <div className="h-full flex flex-col gap-3 w-full">
            {/* Buttons Row 1*/}
            <div className="flex flex-row flex-wrap justify-between mb-20 sm:mb-10 gap-2">
              <div className="flex flex-col">
                <div className="flex mb-8 w-xs gap-4 items-center">
                  <p className="">Employee ID</p>
                  <div className="border border-[#9a9a9a] flex-1  p-1 flex transition-all duration-300 justify-between transform items-center h-[30px] rounded">
                    <p className="text-sm">{employee_id || ""}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap ">
                  <Button
                    type="primary"
                    onClick={() => setIsNewOpportunityModalOpen(true)}
                    disabled={!selectedCustomer}
                  >
                    New Opportunity
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => setIsOpportunityModalOpen(true)}
                    disabled={!selectedOpportunity}
                  >
                    Modify Opportunity
                  </Button>

                  <Button
                    type="outline"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={!selectedOpportunity}
                  >
                    Delete Opportunity
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
