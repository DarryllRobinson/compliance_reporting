import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [severity, setSeverity] = useState("info");
  const [message, setMessage] = useState("");

  const sendAlert = (severity, message) => {
    setSeverity(severity);
    setMessage(message);
    setAlertOpen(true);
  };

  const handleClose = () => setAlertOpen(false);

  return (
    <AlertContext.Provider
      value={{ alertOpen, severity, message, sendAlert, handleClose }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
