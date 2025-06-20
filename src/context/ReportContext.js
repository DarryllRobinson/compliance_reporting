import { createContext, useContext, useState, useCallback } from "react";
import { reportService, userService } from "../services";

export const ReportContext = createContext(null);

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReportContext must be used within a ReportProvider");
  }
  return context;
};

export const ReportProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [changedRows, setChangedRows] = useState({});

  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

  const refreshReports = async () => {
    try {
      const user = userService.userValue;
      const result = await reportService.getAll({ clientId: user.clientId });
      setReports(result || []);
      if (result?.length > 0) {
        localStorage.setItem("reportList", JSON.stringify(result));
        const latest = result.find((r) => r.reportStatus === "Created");
        if (latest) {
          setActiveReport(latest.id);
          setReportDetails(latest);
          localStorage.setItem("activeReportDetails", JSON.stringify(latest));
        } else {
          setActiveReport(null);
          setReportDetails(null);
          localStorage.removeItem("activeReportDetails");
        }
      } else {
        setActiveReport(null);
        setReportDetails(null);
        localStorage.removeItem("activeReportDetails");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports([]);
    }
  };

  const updateRecord = useCallback(
    (id, updatedValues) => {
      setRecords((prev) =>
        prev.map((rec) => (rec.id === id ? { ...rec, ...updatedValues } : rec))
      );

      setChangedRows((prev) => {
        const original = records.find((rec) => rec.id === id);
        const isChanged = Object.keys(updatedValues).some(
          (key) => updatedValues[key] !== original?.[key]
        );
        const newState = { ...prev };
        if (isChanged) {
          newState[id] = "unsaved";
        } else {
          delete newState[id];
        }
        return newState;
      });
    },
    [records]
  );

  // Example place where a report might be deleted or cleared:
  // Whenever setReportDetails(null) or setActiveReport(null) is called, also call:
  // localStorage.removeItem("activeReportId");
  // Since no such code is present here, ensure to add it where relevant in your app.

  return (
    <ReportContext.Provider
      value={{
        records,
        setRecords,
        changedRows,
        setChangedRows,
        updateRecord,
        reports,
        setReports,
        activeReport,
        setActiveReport: (newReportId) => {
          setActiveReport(newReportId);
          const newReport = reports.find((r) => r.id === newReportId);
          if (newReport) {
            setReportDetails(newReport);
            localStorage.setItem(
              "activeReportDetails",
              JSON.stringify(newReport)
            );
          }
        },
        refreshReports, // ✅ ensure this is included in the provider value
        reportDetails,
        setReportDetails: (details) => {
          setReportDetails(details);
          if (details === null) {
            localStorage.removeItem("activeReportDetails");
            localStorage.removeItem("reportList");
            setActiveReport(null);
          } else {
            localStorage.setItem(
              "activeReportDetails",
              JSON.stringify(details)
            );
          }
        },
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
