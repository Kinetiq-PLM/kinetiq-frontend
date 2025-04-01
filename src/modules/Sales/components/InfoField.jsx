const InfoField = ({ label, value = "" }) => {
  return (
    <div className="flex justify-between mb-2 w-full flex-col sm:flex-row">
      <p className="text-gray-700 text-sm">{label}</p>
      <div
        className={`border border-gray-400 flex-1 p-1 min-h-[30px]  min-w-[200px] w-full max-w-[200px] flex items-center ${
          value === "" || value == "Nan" ? "bg-gray-200" : ""
        } rounded`}
      >
        {value !== "NaN" ? value : ""}
      </div>
    </div>
  );
};

export default InfoField;
