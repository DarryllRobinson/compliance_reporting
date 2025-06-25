import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
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
  const [reportDetails, setReportDetails] = useState([]);

  const fetchReports = useCallback(async () => {
    try {
      const user = userService.userValue;
      const result = await reportService.getAll({ clientId: user.clientId });
      if (result && result.length > 0) {
        setReportDetails(result[0]);
        localStorage.setItem("reportDetails", JSON.stringify(result[0]));
      } else {
        setReportDetails(null);
        localStorage.removeItem("reportDetails");
      }
    } catch (err) {
      console.error("Error fetching reportDetails:", err);
      localStorage.removeItem("reportDetails");
    }
  }, []);

  // Load from localStorage once on mount
  useEffect(() => {
    const storedReports = localStorage.getItem("reportDetails");

    if (storedReports) {
      const parsed = JSON.parse(storedReports);
      setReportDetails(parsed);
    } else {
      fetchReports();
    }
  }, [fetchReports]);

  const refreshReports = useCallback(async () => {
    try {
      fetchReports();
    } catch (err) {
      console.error("Error refreshing reportDetails:", err);
      localStorage.removeItem("reportDetails");
    }
  }, [fetchReports]);

  return (
    <ReportContext.Provider
      value={{
        reportDetails,
        refreshReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
