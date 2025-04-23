import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertQueue, setAlertQueue] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);

  const sendAlert = useCallback((severity, message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { severity, message }]);
  }, []);

  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      setCurrentAlert(alertQueue[0]);
    }
  }, [alertQueue, currentAlert]);

  const handleClose = useCallback(() => {
    setAlertQueue((prevQueue) => {
      const [, ...remainingQueue] = prevQueue;
      return remainingQueue;
    });
    setCurrentAlert(null);
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alertOpen: !!currentAlert,
        severity: currentAlert?.severity || "info",
        message: currentAlert?.message || "",
        sendAlert,
        handleClose,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
