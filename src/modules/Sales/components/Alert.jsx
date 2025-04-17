"use client";

import React from "react";

// Utility function to conditionally join class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Alert({
  type = "info",
  title,
  message,
  onClose,
  className,
  autoClose = false,
  autoCloseTime = 5000,
}) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose]);

  if (!isVisible) return null;

  const alertStyles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const iconStyles = {
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-600",
    warning: "bg-yellow-100 text-yellow-600",
    info: "bg-blue-100 text-blue-600",
  };

  return (
    <div
      className={cn(
        "flex items-start p-4 mb-4 border rounded-lg shadow-sm",
        alertStyles[type],
        className
      )}
      role="alert"
    >
      <div
        className={cn(
          "flex-shrink-0 w-5 h-5 mr-3 mt-0.5 flex items-center justify-center rounded-full",
          iconStyles[type]
        )}
      >
        {type === "success" && <span className="text-sm font-bold">✓</span>}
        {type === "error" && <span className="text-sm font-bold">✕</span>}
        {type === "warning" && <span className="text-sm font-bold">!</span>}
        {type === "info" && <span className="text-sm font-bold">i</span>}
      </div>
      <div className="flex-1">
        {title && <h3 className="text-sm font-medium">{title}</h3>}
        <div className="text-sm">{message}</div>
      </div>
      {onClose && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-opacity-25 hover:bg-gray-500"
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <span className="text-lg font-semibold">&times;</span>
        </button>
      )}
    </div>
  );
}
