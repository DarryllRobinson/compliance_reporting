import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tcpService, dcService } from "../../../services";
import { useAlert } from "../../../context/AlertContext";
import PayeesMissingAbnTable from "./PayeesMissingAbnTable";

const DataUploadReview = ({
  errors = [],
  validRecordsPreview = [],
  onErrorsUpdated,
  onRecordsUpdated, // <--- add this prop for new callback
}) => {
  const [validRows, setValidRows] = useState(validRecordsPreview);
  const [editedRows, setEditedRows] = useState({});
  // abnSuggestions: { [payeeName]: { loading: bool, candidates: array, error: string|null } }
  const [abnSuggestions, setAbnSuggestions] = useState({});
  const { showAlert } = useAlert();

  // Debounce utility
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const revalidateRow = (row) => {
    const issues = [];
    if (!row.payerEntityName || row.payerEntityName.trim() === "")
      issues.push("Missing or invalid Payer Entity Name");
    if (!row.payeeEntityName || row.payeeEntityName.trim() === "")
      issues.push("Missing or invalid Payee Entity Name");
    if (!row.payeeEntityAbn || !/^\d{11}$/.test(row.payeeEntityAbn))
      issues.push("Missing or invalid Payee Entity ABN");
    if (isNaN(parseFloat(row.paymentAmount)))
      issues.push("Missing or invalid Payment Amount");
    if (!row.paymentDate || isNaN(Date.parse(row.paymentDate)))
      issues.push("Missing or invalid Payment Date");
    return issues;
  };

  const safeErrors = useMemo(() => {
    return Array.isArray(errors) ? errors : [];
  }, [errors]);

  const preValidatedErrors = useMemo(() => {
    return safeErrors.map((row) => ({
      ...row,
      issues: revalidateRow(row),
    }));
  }, [safeErrors]);

  // useEffect(() => {
  //   // Prevent repeated alerts by only showing on mount (or initial render)
  //   if (safeErrors.length > 0) {
  //     showAlert(
  //       `${safeErrors.length} record${safeErrors.length !== 1 ? "s" : ""} have issues that need to be fixed.`,
  //       "error"
  //     );
  //   }
  // }, [safeErrors, showAlert]); // Remove errors and showAlert from dependency array to prevent infinite loop

  useEffect(() => {
    setValidRows(validRecordsPreview);
  }, [validRecordsPreview]);

  const groupedErrors = useMemo(() => {
    const groups = {};
    preValidatedErrors.forEach((row) => {
      if (Array.isArray(row.issues)) {
        row.issues.forEach((issue) => {
          if (!groups[issue]) groups[issue] = [];
          groups[issue].push(row);
        });
      }
    });
    return groups;
  }, [preValidatedErrors]);

  // --- Payees missing ABN grouping and fix handler ---
  const payeesMissingAbn = useMemo(() => {
    const missing = safeErrors.filter((row) =>
      revalidateRow(row).includes("Missing or invalid Payee Entity ABN")
    );

    const grouped = {};
    for (const row of missing) {
      const name = row.payeeEntityName || "Unknown Payee";
      if (!grouped[name]) grouped[name] = [];
      grouped[name].push(row);
    }
    return grouped;
  }, [safeErrors]);

  const handleAbnFix = (payeeName, newAbn) => {
    const rowsToUpdate = payeesMissingAbn[payeeName].map((row) => ({
      ...row,
      payeeEntityAbn: newAbn,
      issues: revalidateRow({ ...row, payeeEntityAbn: newAbn }),
    }));

    const validOnes = rowsToUpdate
      .filter((r) => r.issues.length === 0)
      .map((row) => {
        // Remove the specific error reason
        const resolvedError = "Missing or invalid Payee Entity ABN";
        const previousReasons = Array.isArray(row.errorReason)
          ? row.errorReason
          : [];
        const updatedReasons = previousReasons.filter(
          (reason) => reason !== resolvedError
        );
        return {
          ...row,
          errorReason: updatedReasons.length > 0 ? updatedReasons : null,
        };
      });
    if (validOnes.length > 0) {
      const updatedErrors = safeErrors.filter(
        (e) => !validOnes.some((v) => v.id === e.id)
      );
      const updatedValid = [...validRows, ...validOnes];
      onRecordsUpdated?.(updatedErrors, updatedValid);
      tcpService
        .patchRecords(validOnes)
        .catch((err) => console.error("Batch patch failed:", err));
      // Insert the validated rows into the tcp dataset
      tcpService
        .bulkCreate(validOnes)
        .then(() => {
          showAlert(
            `Successfully fixed ABN for ${validOnes.length} record${
              validOnes.length !== 1 ? "s" : ""
            }.`,
            "success"
          );
        })
        .catch((err) => {
          console.error("Error updating records:", err);
          showAlert(
            `Failed to fix ABN for ${validOnes.length} record${
              validOnes.length !== 1 ? "s" : ""
            }. Please try again.`,
            "error"
          );
        });
    }
  };

  const handleAbnSearch = async (payeeName) => {
    setAbnSuggestions((prev) => ({
      ...prev,
      [payeeName]: { loading: true, candidates: [], error: null },
    }));
    try {
      const res = await dcService.getAbnCandidatesForNames([
        { name: payeeName },
      ]);
      // Transform res directly into candidates array with expected structure
      let candidates = [];
      if (Array.isArray(res) && res.length > 0) {
        candidates = res.map((item) => ({
          abn: item["Suggested ABN"],
          name: item["Name"],
          confidence: item["Confidence Level"],
          comments: item["Comments"],
          postcode: item["Postcode"],
          state: item["State"],
          status: item["ABN Status"],
        }));
        console.log(`ABN candidates for "${payeeName}":`, candidates);
      }
      setAbnSuggestions((prev) => ({
        ...prev,
        [payeeName]: { loading: false, candidates, error: null },
      }));
    } catch (err) {
      setAbnSuggestions((prev) => ({
        ...prev,
        [payeeName]: {
          loading: false,
          candidates: [],
          error: "Error fetching ABN",
        },
      }));
    }
  };

  // Debounced ABN search
  const debouncedAbnSearch = useMemo(() => debounce(handleAbnSearch, 500), []);

  return (
    <Box sx={{ mt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload Validation Results
          </Typography>

          {/* --- Payees Missing ABNs Table --- */}
          <PayeesMissingAbnTable
            key={
              Object.keys(payeesMissingAbn).length +
              "-" +
              Object.keys(abnSuggestions).length
            }
            payeesMissingAbn={payeesMissingAbn}
            abnSuggestions={abnSuggestions}
            onAbnSearch={debouncedAbnSearch}
            onAbnFix={handleAbnFix}
          />

          {preValidatedErrors.length > 0 ? (
            <>
              {Object.entries(groupedErrors).map(([issueType, rows]) => (
                <Box key={issueType} sx={{ mt: 2 }}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>
                        {issueType} ({rows.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Payer</TableCell>
                              <TableCell>Payee</TableCell>
                              <TableCell>ABN</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Issues</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {/* Track edited state for each row in editedRows state */}
                            {rows.map((row, index) => {
                              const rowEdit = editedRows[row.id] || {};
                              // Compose the displayed row: prefer edited values, then original
                              const rowCopy = {
                                ...row,
                                ...rowEdit,
                                issues: revalidateRow({ ...row, ...rowEdit }),
                              };
                              return (
                                <TableRow key={row.id || index}>
                                  <TableCell>
                                    <input
                                      value={rowCopy.payerEntityName || ""}
                                      onChange={(e) => {
                                        setEditedRows((prev) => ({
                                          ...prev,
                                          [row.id]: {
                                            ...prev[row.id],
                                            payerEntityName: e.target.value,
                                            modified: true,
                                          },
                                        }));
                                      }}
                                      style={{ width: "100%" }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      value={rowCopy.payeeEntityName || ""}
                                      onChange={(e) => {
                                        setEditedRows((prev) => ({
                                          ...prev,
                                          [row.id]: {
                                            ...prev[row.id],
                                            payeeEntityName: e.target.value,
                                            modified: true,
                                          },
                                        }));
                                      }}
                                      style={{ width: "100%" }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      value={rowCopy.payeeEntityAbn || ""}
                                      onChange={(e) => {
                                        setEditedRows((prev) => ({
                                          ...prev,
                                          [row.id]: {
                                            ...prev[row.id],
                                            payeeEntityAbn: e.target.value,
                                            modified: true,
                                          },
                                        }));
                                      }}
                                      style={{ width: "100%" }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      value={rowCopy.paymentAmount || ""}
                                      onChange={(e) => {
                                        setEditedRows((prev) => ({
                                          ...prev,
                                          [row.id]: {
                                            ...prev[row.id],
                                            paymentAmount: e.target.value,
                                            modified: true,
                                          },
                                        }));
                                      }}
                                      style={{ width: "100%" }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      value={rowCopy.paymentDate || ""}
                                      onChange={(e) => {
                                        setEditedRows((prev) => ({
                                          ...prev,
                                          [row.id]: {
                                            ...prev[row.id],
                                            paymentDate: e.target.value,
                                            modified: true,
                                          },
                                        }));
                                      }}
                                      style={{ width: "100%" }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                      {Array.isArray(rowCopy.issues) &&
                                        rowCopy.issues.map((issue, i) => (
                                          <li key={i}>{issue}</li>
                                        ))}
                                    </ul>
                                  </TableCell>
                                  <TableCell>
                                    {rowCopy.issues.length === 0 &&
                                      rowCopy.modified && (
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          onClick={() => {
                                            tcpService
                                              .patchRecord(rowCopy.id, rowCopy)
                                              .then(() => {
                                                const updatedErrors =
                                                  safeErrors.filter(
                                                    (e) => e.id !== rowCopy.id
                                                  );
                                                const updatedValid = [
                                                  ...validRows,
                                                  rowCopy,
                                                ];
                                                onRecordsUpdated?.(
                                                  updatedErrors,
                                                  updatedValid
                                                );
                                                setEditedRows((prev) => {
                                                  const copy = { ...prev };
                                                  delete copy[rowCopy.id];
                                                  return copy;
                                                });
                                              })
                                              .catch(console.error);
                                          }}
                                        >
                                          Save
                                        </Button>
                                      )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}
            </>
          ) : null}

          {validRows.length > 0 && (
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Preview Valid Rows</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Payer</TableCell>
                        <TableCell>Payee</TableCell>
                        <TableCell>ABN</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {validRows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.payerEntityName}</TableCell>
                          <TableCell>{row.payeeEntityName}</TableCell>
                          <TableCell>{row.payeeEntityAbn}</TableCell>
                          <TableCell>{row.paymentAmount}</TableCell>
                          <TableCell>
                            {row.paymentDate
                              ? new Date(row.paymentDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DataUploadReview;
