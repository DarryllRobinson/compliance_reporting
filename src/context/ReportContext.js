import React, { createContext, useState, useContext, useEffect } from "react";

const ReportContext = createContext();

export function ReportProvider({ children }) {
  const [reportDetails, setReportDetails] = useState(() => {
    // Retrieve initial value from localStorage
    const storedDetails = localStorage.getItem("reportDetails");
    return storedDetails ? JSON.parse(storedDetails) : null;
  });

  useEffect(() => {
    // Save reportDetails to localStorage whenever it changes
    if (reportDetails) {
      localStorage.setItem("reportDetails", JSON.stringify(reportDetails));
    } else {
      localStorage.removeItem("reportDetails");
    }
  }, [reportDetails]);

  return (
    <ReportContext.Provider value={{ reportDetails, setReportDetails }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReportContext() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReportContext must be used within a ReportProvider");
  }
  return context;
}
