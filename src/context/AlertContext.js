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

  const sendAlert = useCallback((severity, message, duration = 6000) => {
    setAlertQueue((prevQueue) => [
      ...prevQueue,
      { severity, message, duration },
    ]);
  }, []);

  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      setCurrentAlert(alertQueue[0]);

      // Auto-dismiss the alert after the specified duration
      const timer = setTimeout(() => {
        setAlertQueue((prevQueue) => prevQueue.slice(1));
        setCurrentAlert(null);
      }, alertQueue[0].duration);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alertQueue, currentAlert]);

  const handleClose = useCallback(() => {
    setAlertQueue((prevQueue) => prevQueue.slice(1));
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
