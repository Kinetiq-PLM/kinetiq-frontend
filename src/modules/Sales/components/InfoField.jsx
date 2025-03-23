const InfoField = ({ label, value = "" }) => {
  return (
    <div className="flex items-center gap-2 justify-between">
      <p className="text-gray-700 text-sm">{label}</p>
      <div
        className={`border border-gray-400 flex-1 p-1 h-[30px] w-full max-w-[200px] flex items-center ${
          value === "" || value == "Nan" ? "bg-gray-200" : ""
        } rounded`}
      >
        {value !== "NaN" ? value : ""}
      </div>
    </div>
  );
};

export default InfoField;
