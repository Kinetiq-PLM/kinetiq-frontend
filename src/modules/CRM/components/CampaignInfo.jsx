import React, { useEffect } from "react";
import { useState } from "react";

const InputCustomer = ({ label, value = "", customerListModal }) => {
  return (
    <div className="flex flex-col justify-between mb-2 w-full text-sm">
      <p className="flex-1 mb-1">{label}</p>
      <div
        className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center min-h-[30px] rounded"
        onClick={() => customerListModal(true)}
      >
        <p className="text-sm">{value}</p>
        <img
          src="/icons/information-icon.svg"
          className="h-[15px]"
          alt="info icon"
        />
      </div>
    </div>
  );
};

const Information = ({ label, value = "" }) => {
  return (
    <div className="flex flex-col  justify-between mb-2 w-full text-sm">
      <p className="flex-1 mb-1">{label}</p>
      <div
        className={`border border-[#9a9a9a] flex-1 p-1 min-h-[30px] rounded ${
          value === "" ? "bg-[#f7f7f7]" : ""
        }`}
      >
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
};

const CampaignInfo = ({ campaignListModal, campaign }) => {
  return (
    <section className="flex md:justify-between md:gap-6 flex-col md:flex-row">
      <div className="h-full w-full flex flex-col items-center">
        <InputCustomer
          label={"Campaign ID"}
          value={campaign.campaign_id}
          customerListModal={campaignListModal}
        />
        <Information label={"Campaign Type"} value={campaign.type} />
      </div>
      <div className="w-full hidden xl:block"></div>
      <div className="h-full w-full flex flex-col items-center">
        <Information label={"Campaign Name"} value={campaign.campaign_name} />
        <Information label={"Campaign Status"} value={campaign.status} />
      </div>
    </section>
  );
};

export default CampaignInfo;
