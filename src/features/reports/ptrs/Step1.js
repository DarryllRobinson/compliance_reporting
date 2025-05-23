// Utility function to normalize a record object
import { useState } from "react";
import { Typography } from "@mui/material";
import CollapsibleTable from "./CollapsibleTable";

export default function Step1({ records = [], onRecordChange }) {
  const [changedRows, setChangedRows] = useState({});

  if (records.length === 0) {
    return (
      <Typography variant="h6">No records available to display.</Typography>
    );
  }

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>
        🟡 <strong>{records.length}</strong> record(s) loaded for review.
      </Typography>
      <Typography variant="body1">
        {records.filter((r) => String(r.payeeEntityAbn ?? "").trim() === "")
          .length > 0
          ? "⚠️"
          : "✅"}{" "}
        <strong>
          {
            records.filter((r) => String(r.payeeEntityAbn ?? "").trim() === "")
              .length
          }
        </strong>{" "}
        record(s) missing Payee ABN
      </Typography>
      <Typography variant="body1">
        {records.filter(
          (r) =>
            !(typeof r.payeeEntityName === "string" && r.payeeEntityName.trim())
        ).length > 0
          ? "⚠️"
          : "✅"}{" "}
        <strong>
          {
            records.filter(
              (r) =>
                !(
                  typeof r.payeeEntityName === "string" &&
                  r.payeeEntityName.trim()
                )
            ).length
          }
        </strong>{" "}
        record(s) missing Payee Name
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        🧠{" "}
        <strong>
          {records.filter((r) => r.systemRecommendation === false).length}
        </strong>{" "}
        record(s) are recommended by the system to be excluded from TCP.
      </Typography>

      <CollapsibleTable
        records={records}
        savedRecords={records}
        changedRows={changedRows}
        setChangedRows={setChangedRows}
        isLocked={false}
        currentStep={1}
        requiresAttention={{}}
        sortConfig={null}
        setSortConfig={() => {}}
        onPageChangeWithSave={() => {}}
        onRecordChange={onRecordChange}
      />
    </>
  );
}
