"use client";

const Button = ({
  children,
  onClick = () => {},
  type = "",
  className,
  disabled = false,
  submit = false,
}) => {
  let styling =
    "py-1 px-6 font-medium transition-all duration-300 ease-in-out transform";

  if (type === "primary") {
    styling +=
      " bg-[#00A8A8] text-white hover:bg-[#008080] rounded-md hover:shadow-lg";
  } else if (type === "outline") {
    styling +=
      " border border-[#00A8A8] text-[#00A8A8] rounded-md transition-colors duration-300 hover:bg-[#E4FDFB] hover:shadow-md";
  } else if (type === "link" || type === "active") {
    styling += " border-b-2 transition-all duration-500 ease-in-out";

    if (type === "link") {
      styling +=
        " text-gray-400 border-transparent hover:border-[#00A8A8] hover:text-[#00A8A8]";
    } else if (type === "active") {
      styling += " text-[#00A8A8] border-[#00A8A8]";
    }
  }

  return (
    <button
      className={`cursor-pointer  ${styling}  ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      onClick={onClick}
      type={submit ? "submit" : "button"}
    >
      {children}
    </button>
  );
};

export default Button;
