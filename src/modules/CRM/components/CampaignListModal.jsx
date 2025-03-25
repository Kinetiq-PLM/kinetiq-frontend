"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Sales/components/Context/AlertContext.jsx";

import Table from "../../Sales/components/Table";
import Button from "../../Sales/components/Button.jsx";
import { GET } from "../../Sales/api/api.jsx";
import { useQuery } from "@tanstack/react-query";

const CampaignListModal = ({ isOpen, onClose, campaign, setCampaign }) => {
  const { showAlert } = useAlert();

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Filtered data is used to filter the data based on the search term
  const [filteredData, setFilteredData] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const campaignQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => await GET("crm/campaigns"),
    enabled: isOpen,
  });

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const columns = [
    { key: "campaign_id", label: "Campaign ID" },
    { key: "campaign_name", label: "Name" }, // Company Name
    { key: "type", label: "Type" }, // Country
  ];

  const handleConfirm = () => {
    if (selectedCampaign) {
      setCampaign(selectedCampaign); // Properly update the array
      onClose();
      showAlert({
        type: "success",
        title: "Added product.",
      });
      setSelectedCampaign(null);
    }
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

  useEffect(() => {
    if (campaignQuery.status === "success") {
      const data = campaignQuery.data.map((campaign) => ({
        campaign_id: campaign.campaign_id,
        campaign_name: campaign.campaign_name,
        type: campaign.type,
      }));
      setCampaignList(data);
      setFilteredData(data);
    }
  }, [campaignQuery.data]);

  // useEffect(() => {
  //   console.log(campaignList);
  // }, [campaignList]);
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
            List Of Campaigns
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
          <div className="mb-4 flex items-center">
            <p className="mr-2">Search:</p>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-2 py-1 border border-gray-300 rounded-md max-w-[300px]"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filtered = campaignList.filter((campaign) =>
                  campaign.campaign_name.toLowerCase().includes(searchTerm)
                );
                setFilteredData(filtered);
              }}
            />
          </div>
          <div className="h-[300px] overflow-auto border border-[#CBCBCB] rounded-md">
            <Table
              columns={columns}
              data={filteredData}
              onSelect={setSelectedCampaign}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedCampaign}
              >
                Add
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

export default CampaignListModal;
