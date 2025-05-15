import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Button,
  TextField,
  TablePagination,
  useTheme,
  Alert,
} from "@mui/material";
import { useAlert } from "../../../context";
import { fieldMapping } from "./fieldMapping"; // Import fieldMapping
import { useNavigate } from "react-router"; // Import useNavigate
import { tcpService, userService } from "../../../services";
import { formatDateForMySQL } from "../../../utils/formatDate";
import { getRowHighlightColor } from "../../../utils/highlightRow";

export default function Step1({
  savedRecords = [],
  onNext,
  reportId,
  reportStatus,
}) {
  const theme = useTheme();
  const { sendAlert } = useAlert();
  const navigate = useNavigate();
  const isLocked = reportStatus === "Submitted";
  const [records, setRecords] = useState(savedRecords);
  const [filteredRecords, setFilteredRecords] = useState(savedRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [tcpStatus, setTcpStatus] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.isTcp || false;
      return acc;
    }, {})
  );

  useEffect(() => {
    setRecords(savedRecords);
    setFilteredRecords(savedRecords);
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

  const [fields, setFields] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = {
        paymentTerm: record.paymentTerm || 0,
      };
      return acc;
    }, {})
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const saveChangedRows = async () => {
    // Utility to get only updated fields
    function getUpdatedFields(original, current) {
      const updates = {};
      for (const key in current) {
        const currentVal = current[key];
        const originalVal = original[key];

        const isDifferent =
          currentVal !== undefined &&
          currentVal !== originalVal &&
          !(
            typeof currentVal === "string" &&
            typeof originalVal === "string" &&
            currentVal.trim() === originalVal?.trim()
          );

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
          tcpExclusionComment:
            typeof tcpExclusionComments[record.id] === "string" &&
            tcpExclusionComments[record.id].trim() === ""
              ? null
              : tcpExclusionComments[record.id],
          paymentDate: formatDateForMySQL(record.paymentDate),
        });

        return {
          id: record.id,
          ...patch,
          updatedBy: userService.userValue.id,
        };
      });

      try {
        console.log("Saving changed records:", updatedRecords);
        const results = await Promise.all(
          updatedRecords.map((record) =>
            tcpService.patchRecord(record.id, record)
          )
        );
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
      } catch (error) {
        console.error("Error saving changed records:", error);
        sendAlert("error", "An error occurred while saving changed records.");
      }
    }
  };
  // Handler for tcpExclusionComment changes
  const handleTcpExclusionCommentChange = (id, value) => {
    setTcpExclusionComments((prev) => {
      const updated = { ...prev, [id]: value };

      const originalValue =
        savedRecords.find((record) => record.id === id)?.tcpExclusionComment ||
        "";
      const isReverted = updated[id] === originalValue;

      setChangedRows((prevChanged) => ({
        ...prevChanged,
        [id]: isReverted ? false : "unsaved",
      }));

      return updated;
    });
  };

  const handleSaveAll = async () => {
    await saveChangedRows(); // Save only unsaved rows when the user clicks the save button
  };

  const handleChangePage = async (event, newPage) => {
    await saveChangedRows(); // Save only unsaved rows before navigating
    setPage(newPage);
  };

  const handleTcpToggle = (id) => {
    setTcpStatus((prev) => {
      const updatedStatus = {
        ...prev,
        [id]: !prev[id],
      };

      // Check if the value matches the original value from savedRecords
      const originalValue = savedRecords.find(
        (record) => record.id === id
      )?.isTcp;
      const isReverted = updatedStatus[id] === originalValue;

      setChangedRows((prev) => ({
        ...prev,
        [id]: isReverted ? false : "unsaved", // Remove orange highlight if reverted
      }));

      return updatedStatus;
    });
  };

  const handleSearch = (event) => {
    const lowerCaseSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(lowerCaseSearchTerm);

    // Filter records based on the search term
    setFilteredRecords(
      records.filter(
        (record) =>
          Object.values(record)
            .join(" ") // Combine all record values into a single string
            .toLowerCase()
            .includes(lowerCaseSearchTerm) // Check if the search term is included
      )
    );
  };

  const displayedRecords = useMemo(
    () =>
      filteredRecords.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredRecords, page, rowsPerPage]
  );

  const MemoizedTableRow = React.memo(({ record }) => (
    <TableRow
      key={record.id}
      sx={{
        backgroundColor: getRowHighlightColor(record, changedRows),
      }}
    >
      {fieldMapping.map((field, fieldIndex) => {
        if (field.name === "tcpExclusionComment") {
          // Render editable cell for tcpExclusionComment
          return (
            <TableCell key={fieldIndex} sx={{ width: "300px" }}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                multiline
                value={tcpExclusionComments[record.id] || ""}
                onChange={(e) =>
                  handleTcpExclusionCommentChange(record.id, e.target.value)
                }
                disabled={isLocked}
              />
            </TableCell>
          );
        }
        return (
          <TableCell key={fieldIndex}>{record[field.name] || "-"}</TableCell>
        );
      })}
      <TableCell>
        <Checkbox
          checked={!!tcpStatus[record.id]}
          onChange={() => handleTcpToggle(record.id)}
          disabled={isLocked}
        />
      </TableCell>
    </TableRow>
  ));

  if (records.length === 0) {
    return (
      <Typography variant="h6">No records available to display.</Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      {isLocked && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This report has already been submitted and cannot be edited.
        </Alert>
      )}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Review Records
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch} // Use the updated search handler
        sx={{ marginBottom: 2 }}
        disabled={isLocked}
      />
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {fieldMapping.map((field, index) => (
                <TableCell key={index}>{field.label}</TableCell>
              ))}
              <TableCell>Mark as TCP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.map((record) => (
              <MemoizedTableRow key={record.id} record={record} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRecords.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAll}
          sx={{ marginRight: 2 }}
          disabled={isLocked}
        >
          Save All Changes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={async () => {
            await saveChangedRows();
            if (onNext) {
              onNext();
            } else {
              navigate(`/reports/ptrs/step2/${reportId}`);
            }
          }}
          disabled={isLocked}
        >
          Next: Add Additional Details
        </Button>
      </Box>
    </Box>
  );
}
