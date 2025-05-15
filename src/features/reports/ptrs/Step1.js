import React, { useState, useEffect, useCallback } from "react";
import { Typography, useTheme } from "@mui/material";
import { useAlert } from "../../../context";
import { fieldMapping } from "./fieldMapping"; // Import fieldMapping
import { tcpService, userService } from "../../../services";
import CollapsibleTable from "./CollapsibleTable";

export default function Step1({
  savedRecords = [],
  onNext,
  reportId,
  reportStatus,
}) {
  const currentStep = 1;
  const theme = useTheme();
  const { sendAlert } = useAlert();
  const isLocked = reportStatus === "Submitted";
  const [records, setRecords] = useState(savedRecords);
  const [filteredRecords, setFilteredRecords] = useState(savedRecords);
  const [tcpStatus, setTcpStatus] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.isTcp !== false;
      return acc;
    }, {})
  );

  useEffect(() => {
    setRecords((prev) => {
      if (prev !== savedRecords) return savedRecords;
      return prev;
    });

    setFilteredRecords((prev) => {
      if (prev !== savedRecords) return savedRecords;
      return prev;
    });
  }, [savedRecords]);

  const [changedRows, setChangedRows] = useState(() =>
    savedRecords.reduce((acc, record) => {
      if (new Date(record.updatedAt) > new Date(record.createdAt)) {
        acc[record.id] = "saved"; // Mark rows as saved if updatedAt > createdAt
      } else {
        acc[record.id] = false; // Initialize other rows as unchanged
      }
      return acc;
    }, {})
  );

  // State for tcpExclusionComment field per record
  const [tcpExclusionComments, setTcpExclusionComments] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.tcpExclusionComment || "";
      return acc;
    }, {})
  );

  const saveChangedRows = async () => {
    // Utility to get only updated fields
    function getUpdatedFields(original, current) {
      const updates = {};
      for (const key in current) {
        const currentVal = current[key];
        const originalVal = original[key];

        const isDifferent = (currentVal ?? null) !== (originalVal ?? null); // nullish-aware comparison

        if (isDifferent) {
          updates[key] = currentVal;
        }
      }
      return updates;
    }

    // Filter records that are marked as "unsaved"
    const rowsToSave = records.filter(
      (record) => changedRows[record.id] === "unsaved"
    );
    if (rowsToSave.length > 0) {
      const updatedRecords = rowsToSave.map((record) => {
        const { createdAt, updatedAt, ...cleanRecord } = record;
        const original = savedRecords.find((r) => r.id === record.id) || {};

        const patch = getUpdatedFields(original, {
          ...cleanRecord,
          isTcp: !!tcpStatus[record.id],
          tcpExclusionComment: tcpExclusionComments[record.id]?.trim() || null,
          // paymentDate: formatDateForMySQL(record.paymentDate),
        });

        return {
          id: record.id,
          ...patch,
          updatedBy: userService.userValue.id,
        };
      });

      try {
        const response = await Promise.all(
          updatedRecords.map((record) =>
            tcpService.patchRecord(record.id, record)
          )
        );
        if (response[0].success) {
          sendAlert("success", "Changed records saved successfully.");

          // Update only the changed rows in the `records` and `filteredRecords` states
          setRecords((prev) => {
            const updatedRecordsMap = new Map(
              updatedRecords.map((row) => [row.id, row])
            );
            return prev.map((record) =>
              updatedRecordsMap.has(record.id)
                ? { ...record, ...updatedRecordsMap.get(record.id) }
                : record
            );
          });

          setFilteredRecords((prev) => {
            const updatedRecordsMap = new Map(
              updatedRecords.map((row) => [row.id, row])
            );
            return prev.map((record) =>
              updatedRecordsMap.has(record.id)
                ? { ...record, ...updatedRecordsMap.get(record.id) }
                : record
            );
          });

          setTcpExclusionComments((prev) => {
            const updated = { ...prev };
            updatedRecords.forEach((rec) => {
              updated[rec.id] = rec.tcpExclusionComment || "";
            });
            return updated;
          });

          // Mark saved rows as successfully saved
          setChangedRows((prev) =>
            rowsToSave.reduce(
              (acc, row) => {
                acc[row.id] = "saved";
                return acc;
              },
              { ...prev }
            )
          );
        } else {
          sendAlert("error", "Failed to save changed records.");
        }
      } catch (error) {
        console.error("Error saving changed records:", error);
        sendAlert("error", "An error occurred while saving changed records.");
      }
    }
  };

  if (records.length === 0) {
    return (
      <Typography variant="h6">No records available to display.</Typography>
    );
  }

  return (
    <CollapsibleTable
      records={records}
      savedRecords={savedRecords}
      changedRows={changedRows}
      setChangedRows={setChangedRows}
      tcpStatus={tcpStatus}
      setTcpStatus={setTcpStatus}
      tcpExclusionComments={tcpExclusionComments}
      setTcpExclusionComments={setTcpExclusionComments}
      isLocked={isLocked}
      currentStep={currentStep}
      theme={theme}
    />
  );
}
