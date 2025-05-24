import { createContext, useContext, useState, useCallback } from "react";

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

  return (
    <ReportContext.Provider
      value={{
        records,
        setRecords,
        changedRows,
        setChangedRows,
        updateRecord,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
