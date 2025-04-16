"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Alert } from "../Alert.jsx";

const AlertContext = createContext(undefined);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((options) => {
    // Set default autoClose to true and autoCloseTime to 5000ms (5 seconds)
    setAlert({
      ...options,
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      autoCloseTime: options.autoCloseTime || 5000,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 my-auto md:w-96 z-50">
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={hideAlert}
            autoClose={alert.autoClose}
            autoCloseTime={alert.autoCloseTime}
          />
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
