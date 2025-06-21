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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tcpService } from "../../../services";
import { useAlert } from "../../../context/AlertContext";

const DataUploadReview = ({
  errors = [],
  validRecordsPreview = [],
  onErrorsUpdated,
}) => {
  const [validRows, setValidRows] = useState(validRecordsPreview);
  const { showAlert } = useAlert();

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

  useEffect(() => {
    // Prevent repeated alerts by only showing on mount (or initial render)
    if (safeErrors.length > 0) {
      showAlert(
        `${safeErrors.length} record${safeErrors.length !== 1 ? "s" : ""} have issues that need to be fixed.`,
        "error"
      );
    }
  }, []); // Remove errors and showAlert from dependency array to prevent infinite loop

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

    const validOnes = rowsToUpdate.filter((r) => r.issues.length === 0);
    if (validOnes.length > 0) {
      setValidRows((prev) => [...prev, ...validOnes]);
      onErrorsUpdated?.((prevErrors) =>
        prevErrors.filter((e) => !validOnes.some((v) => v.id === e.id))
      );
      Promise.all(validOnes.map((r) => tcpService.patchRecord(r.id, r)));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload Validation Results
          </Typography>

          {/* --- Payees Missing ABNs Table --- */}
          {Object.keys(payeesMissingAbn).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Payees Missing ABNs</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Payee Name</TableCell>
                      <TableCell>Fix ABN</TableCell>
                      <TableCell># Records</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(payeesMissingAbn)
                      .sort((a, b) => b[1].length - a[1].length)
                      .map(([payeeName, rows]) => (
                        <TableRow key={payeeName}>
                          <TableCell>{payeeName}</TableCell>
                          <TableCell>
                            <input
                              type="text"
                              placeholder="Enter valid ABN"
                              onBlur={(e) =>
                                handleAbnFix(payeeName, e.target.value.trim())
                              }
                              style={{ width: "100%" }}
                            />
                          </TableCell>
                          <TableCell>{rows.length}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

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
                            {rows.map((row, index) => (
                              <TableRow key={row.id || index}>
                                <TableCell>
                                  <input
                                    value={row.payerEntityName || ""}
                                    onChange={(e) => {
                                      const updated = [...preValidatedErrors];
                                      const rowCopy = {
                                        ...row,
                                        payerEntityName: e.target.value,
                                      };
                                      rowCopy.issues = revalidateRow(rowCopy);

                                      if (rowCopy.issues.length === 0) {
                                        const filtered = updated.filter(
                                          (r) => r.id !== row.id
                                        );
                                        onErrorsUpdated &&
                                          onErrorsUpdated(filtered);
                                        setValidRows([...validRows, rowCopy]);
                                        tcpService
                                          .patchRecord(rowCopy.id, rowCopy)
                                          .catch(console.error);
                                      } else {
                                        const idx = updated.findIndex(
                                          (r) => r.id === row.id
                                        );
                                        if (idx !== -1) updated[idx] = rowCopy;
                                        onErrorsUpdated &&
                                          onErrorsUpdated(updated);
                                      }
                                    }}
                                    style={{ width: "100%" }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    value={row.payeeEntityName || ""}
                                    onChange={(e) => {
                                      const updated = [...preValidatedErrors];
                                      const rowCopy = {
                                        ...row,
                                        payeeEntityName: e.target.value,
                                      };
                                      rowCopy.issues = revalidateRow(rowCopy);

                                      if (rowCopy.issues.length === 0) {
                                        const filtered = updated.filter(
                                          (r) => r.id !== row.id
                                        );
                                        onErrorsUpdated &&
                                          onErrorsUpdated(filtered);
                                        setValidRows([...validRows, rowCopy]);
                                        tcpService
                                          .patchRecord(rowCopy.id, rowCopy)
                                          .catch(console.error);
                                      } else {
                                        const idx = updated.findIndex(
                                          (r) => r.id === row.id
                                        );
                                        if (idx !== -1) updated[idx] = rowCopy;
                                        onErrorsUpdated &&
                                          onErrorsUpdated(updated);
                                      }
                                    }}
                                    style={{ width: "100%" }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    value={row.payeeEntityAbn || ""}
                                    onChange={(e) => {
                                      const updated = [...preValidatedErrors];
                                      const rowCopy = {
                                        ...row,
                                        payeeEntityAbn: e.target.value,
                                      };
                                      rowCopy.issues = revalidateRow(rowCopy);

                                      if (rowCopy.issues.length === 0) {
                                        const filtered = updated.filter(
                                          (r) => r.id !== row.id
                                        );
                                        onErrorsUpdated &&
                                          onErrorsUpdated(filtered);
                                        setValidRows([...validRows, rowCopy]);
                                        tcpService
                                          .patchRecord(rowCopy.id, rowCopy)
                                          .catch(console.error);
                                      } else {
                                        const idx = updated.findIndex(
                                          (r) => r.id === row.id
                                        );
                                        if (idx !== -1) updated[idx] = rowCopy;
                                        onErrorsUpdated &&
                                          onErrorsUpdated(updated);
                                      }
                                    }}
                                    style={{ width: "100%" }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    value={row.paymentAmount || ""}
                                    onChange={(e) => {
                                      const updated = [...preValidatedErrors];
                                      const rowCopy = {
                                        ...row,
                                        paymentAmount: e.target.value,
                                      };
                                      rowCopy.issues = revalidateRow(rowCopy);

                                      if (rowCopy.issues.length === 0) {
                                        const filtered = updated.filter(
                                          (r) => r.id !== row.id
                                        );
                                        onErrorsUpdated &&
                                          onErrorsUpdated(filtered);
                                        setValidRows([...validRows, rowCopy]);
                                        tcpService
                                          .patchRecord(rowCopy.id, rowCopy)
                                          .catch(console.error);
                                      } else {
                                        const idx = updated.findIndex(
                                          (r) => r.id === row.id
                                        );
                                        if (idx !== -1) updated[idx] = rowCopy;
                                        onErrorsUpdated &&
                                          onErrorsUpdated(updated);
                                      }
                                    }}
                                    style={{ width: "100%" }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    value={row.paymentDate || ""}
                                    onChange={(e) => {
                                      const updated = [...preValidatedErrors];
                                      const rowCopy = {
                                        ...row,
                                        paymentDate: e.target.value,
                                      };
                                      rowCopy.issues = revalidateRow(rowCopy);

                                      if (rowCopy.issues.length === 0) {
                                        const filtered = updated.filter(
                                          (r) => r.id !== row.id
                                        );
                                        onErrorsUpdated &&
                                          onErrorsUpdated(filtered);
                                        setValidRows([...validRows, rowCopy]);
                                        tcpService
                                          .patchRecord(rowCopy.id, rowCopy)
                                          .catch(console.error);
                                      } else {
                                        const idx = updated.findIndex(
                                          (r) => r.id === row.id
                                        );
                                        if (idx !== -1) updated[idx] = rowCopy;
                                        onErrorsUpdated &&
                                          onErrorsUpdated(updated);
                                      }
                                    }}
                                    style={{ width: "100%" }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                                    {Array.isArray(row.issues) &&
                                      row.issues.map((issue, i) => (
                                        <li key={i}>{issue}</li>
                                      ))}
                                  </ul>
                                </TableCell>
                              </TableRow>
                            ))}
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
