const InputField = ({ label, value = "", setValue = () => {} }) => {
  return (
    <div className="flex-1">
      <p className="text-sm">
        {label}
        <span className="text-red-900 ml-1">*</span>
      </p>
      <div className="mt-2">
        <input
          className="bg-[#F9FAFA] w-full py-2 px-3 rounded"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InputField;
