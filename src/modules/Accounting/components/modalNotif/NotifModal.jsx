import React, { useEffect, useState } from "react";
import Button from "../button/Button";

const NotifModal = ({ isOpen, onClose, type = "success", title, message }) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowModal(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setShowModal(false);
          if (onClose) onClose();
        }, 300); // Animation out time
      }, 5000); // Show for 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!showModal) return null;

  const iconSrc = {
    success: "./accounting/success.svg",
    warning: "./accounting/warning.svg",
    error: "./accounting/error.svg",
  }[type] || "./accounting/success.svg";

  // Different background colors based on notification type
  const bgColors = {
    success: "bg-green-50 border-l-4 border-green-500",
    warning: "bg-yellow-50 border-l-4 border-yellow-500",
    error: "bg-red-50 border-l-4 border-red-500",
  }[type] || "bg-green-50 border-l-4 border-green-500";

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex justify-end pointer-events-none"
      aria-live="polite"
    >
      <div 
        className={`
          pointer-events-auto shadow-lg rounded-md overflow-hidden max-w-md
          transform transition-all duration-300
          ${isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
          ${bgColors}
        `}
      >
        <div className="p-4 flex items-start">
          <div className="flex-shrink-0 mr-3">
            <img
              width={24}
              height={24}
              src={iconSrc}
              alt={type}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            <div className="mt-3">
              <Button 
                name="Dismiss" 
                variant="standard2" 
                onclick={() => {
                  setIsAnimating(false);
                  setTimeout(() => {
                    setShowModal(false);
                    if (onClose) onClose();
                  }, 300);
                }}
                className="text-xs py-1 px-2"
              />
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 hover:text-gray-500"
              onClick={() => {
                setIsAnimating(false);
                setTimeout(() => {
                  setShowModal(false);
                  if (onClose) onClose();
                }, 300);
              }}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress bar that shrinks over time */}
        <div className="bg-gray-200 h-1 w-full">
          <div 
            className={`h-1 ${type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{
              width: '100%',
              animation: 'shrink 5s linear forwards'
            }}
          />
        </div>
        
        <style jsx>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default NotifModal;