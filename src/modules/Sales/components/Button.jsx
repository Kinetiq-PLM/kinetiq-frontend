"use client";

const Button = ({
  children,
  onClick = () => {},
  type = "",
  className,
  disabled = false,
  submit = false,
}) => {
  let styling = "py-1 px-6 rounded-md font-medium transition-all duration-500";

  if (type === "primary") {
    styling += " bg-[#00A8A8] text-white hover:bg-[#008080]";
  } else if (type === "outline") {
    styling += " border border-[#00A8A8] text-[#00A8A8] hover:bg-[#E4FDFB]";
  }

  return (
    <button
      className={`cursor-pointer ${styling} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      type={submit ? "submit" : "button"}
    >
      {children}
    </button>
  );
};

export default Button;
