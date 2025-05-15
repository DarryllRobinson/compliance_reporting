import React, { useState, useMemo, useEffect, useCallback } from "react";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import IconButton from "@mui/material/IconButton";
import { useAlert } from "../../../context";
import { fieldMapping } from "./fieldMapping"; // Import fieldMapping
import { useNavigate } from "react-router"; // Import useNavigate
import { tcpService, userService } from "../../../services";
import { formatDateForMySQL, formatCurrency } from "../../../utils/formatters";
import { getRowHighlightColor } from "../../../utils/highlightRow";

export default function Step1({
  savedRecords = [],
  onNext,
  reportId,
  reportStatus,
}) {
  const currentStep = 1;
  const theme = useTheme();
  const { sendAlert } = useAlert();
  const navigate = useNavigate();
  const isLocked = reportStatus === "Submitted";
  const [records, setRecords] = useState(savedRecords);
  const [filteredRecords, setFilteredRecords] = useState(savedRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [tcpStatus, setTcpStatus] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.isTcp !== false;
      return acc;
    }, {})
  );

  // Collapsible groups state and logic
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const toggleGroup = useCallback(
    (group) =>
      setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] })),
    []
  );

  // Derive visible fields grouped by group name
  const groupedVisibleFields = useMemo(() => {
    const filtered = fieldMapping.filter(
      (field) =>
        !field.requiredAtStep || field.requiredAtStep.includes(currentStep)
    );

    const groups = {};
    for (const field of filtered) {
      const group = field.group || "other";
      if (!groups[group]) groups[group] = [];
      groups[group].push(field);
    }

    return groups;
  }, [currentStep]);

  useEffect(() => {
    setRecords(savedRecords);
    setFilteredRecords(savedRecords);
  }, [savedRecords]);

  const [tcpExclusions, setTcpExclusions] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.tcpExclusion || "";
      return acc;
    }, {})
  );

  const handleTcpExclusionChange = (id, value) => {
    setTcpExclusions((prev) => {
      const updatedExclusions = {
        ...prev,
        [id]: value,
      };

      // Check if the value matches the original value from savedRecords
      const originalValue =
        savedRecords.find((record) => record.id === id)?.tcpExclusion || "";
      const isReverted = updatedExclusions[id] === originalValue;

      setChangedRows((prev) => ({
        ...prev,
        [id]: isReverted ? false : "unsaved", // Remove orange highlight if reverted
      }));

      return updatedExclusions;
    });
  };

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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

      const originalValue = !!savedRecords.find((record) => record.id === id)
        ?.isTcp;
      const isReverted = updatedStatus[id] === originalValue;

      setChangedRows((prev) => ({
        ...prev,
        [id]: isReverted ? false : "unsaved",
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
      {/* Show All Columns button and warning */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => setCollapsedGroups({})}
          color="primary"
        >
          Show All Columns
        </Button>
        {Object.values(collapsedGroups).filter(Boolean).length ===
          Object.keys(groupedVisibleFields).length && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            All column groups are hidden. Use "Show All Columns" to reset.
          </Typography>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {Object.entries(groupedVisibleFields).map(([group, fields]) => (
                <TableCell
                  key={group}
                  align="center"
                  colSpan={collapsedGroups[group] ? 1 : fields.length}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    fontWeight: "bold",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleGroup(group)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {group.toUpperCase()}
                    <IconButton size="small" sx={{ ml: 1, color: "inherit" }}>
                      {collapsedGroups[group] ? (
                        <KeyboardArrowRightIcon fontSize="inherit" />
                      ) : (
                        <KeyboardArrowDownIcon fontSize="inherit" />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {Object.entries(groupedVisibleFields).flatMap(
                ([group, fields]) =>
                  collapsedGroups[group]
                    ? [<TableCell key={`${group}-collapsed`} />]
                    : fields.map((field) => (
                        <TableCell key={field.name}>{field.label}</TableCell>
                      ))
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  backgroundColor: getRowHighlightColor(record, changedRows),
                }}
              >
                {Object.entries(groupedVisibleFields).flatMap(
                  ([group, fields]) =>
                    collapsedGroups[group]
                      ? [<TableCell key={`${group}-collapsed`} />]
                      : fields.map((field) => (
                          <TableCell key={`${record.id}-${field.name}`}>
                            {field.type === "amount" ? (
                              formatCurrency(record[field.name])
                            ) : field.type === "date" ? (
                              formatDateForMySQL(record[field.name])
                            ) : field.name === "isTcp" ? (
                              <Checkbox
                                checked={!!tcpStatus[record.id]}
                                onChange={() => handleTcpToggle(record.id)}
                                disabled={isLocked}
                              />
                            ) : field.name === "tcpExclusionComment" ? (
                              <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                multiline
                                value={tcpExclusionComments[record.id] || ""}
                                onChange={(e) =>
                                  setTcpExclusionComments((prev) => {
                                    const updated = {
                                      ...prev,
                                      [record.id]: e.target.value,
                                    };
                                    const originalValue =
                                      savedRecords.find(
                                        (r) => r.id === record.id
                                      )?.tcpExclusionComment || "";
                                    const isReverted =
                                      updated[record.id] === originalValue;
                                    setChangedRows((prevChanged) => ({
                                      ...prevChanged,
                                      [record.id]: isReverted
                                        ? false
                                        : "unsaved",
                                    }));
                                    return updated;
                                  })
                                }
                                disabled={isLocked}
                              />
                            ) : (
                              record[field.name] || "-"
                            )}
                          </TableCell>
                        ))
                )}
              </TableRow>
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
