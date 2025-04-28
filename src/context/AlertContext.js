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
  const [hasActiveAlert, setHasActiveAlert] = useState(false); // Track active alert

  const sendAlert = useCallback((severity, message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { severity, message }]);
    setHasActiveAlert(true); // Set active alert flag
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
    if (alertQueue.length <= 1) {
      setHasActiveAlert(false); // Reset active alert flag when queue is empty
    }
  }, [alertQueue]);

  return (
    <AlertContext.Provider
      value={{
        alertOpen: !!currentAlert,
        severity: currentAlert?.severity || "info",
        message: currentAlert?.message || "",
        sendAlert,
        handleClose,
        hasActiveAlert, // Expose active alert flag
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
