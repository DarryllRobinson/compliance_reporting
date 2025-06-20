import React from "react";
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
  const [validRows, setValidRows] = React.useState(validRecordsPreview);
  const { showAlert } = useAlert();

  React.useEffect(() => {
    if (errors.length > 0) {
      showAlert(
        `${errors.length} record${errors.length !== 1 ? "s" : ""} have issues that need to be fixed.`,
        "error"
      );
    }
  }, [errors]);

  React.useEffect(() => {
    if (errors.length === 0) {
      showAlert("No issues detected in uploaded file.", "success");
    }
  }, [errors]);

  const revalidateRow = (row) => {
    const issues = [];
    if (!row.payerEntityName || row.payerEntityName.trim() === "")
      issues.push("Missing or invalid payerEntityName");
    if (!row.payeeEntityName || row.payeeEntityName.trim() === "")
      issues.push("Missing or invalid payeeEntityName");
    if (!row.payeeEntityAbn || !/^\d{11}$/.test(row.payeeEntityAbn))
      issues.push("Missing or invalid payeeEntityAbn");
    if (isNaN(parseFloat(row.paymentAmount)))
      issues.push("Missing or invalid paymentAmount");
    if (!row.paymentDate || isNaN(Date.parse(row.paymentDate)))
      issues.push("Missing or invalid paymentDate");
    return issues;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload Validation Results
          </Typography>

          {errors.length > 0 ? (
            <>
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
                    {errors.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <input
                            value={row.payerEntityName || ""}
                            onChange={(e) => {
                              const updated = [...errors];
                              const rowCopy = {
                                ...updated[index],
                                payerEntityName: e.target.value,
                              };
                              rowCopy.issues = revalidateRow(rowCopy);

                              if (rowCopy.issues.length === 0) {
                                updated.splice(index, 1); // remove from errors
                                onErrorsUpdated && onErrorsUpdated(updated);
                                setValidRows([...validRows, rowCopy]); // move to preview
                                tcpService
                                  .patchRecord(rowCopy.id, rowCopy)
                                  .catch((err) => {
                                    console.error(
                                      "Failed to patch record:",
                                      err
                                    );
                                  });
                              } else {
                                updated[index] = rowCopy;
                                onErrorsUpdated && onErrorsUpdated(updated);
                              }
                            }}
                            style={{ width: "100%" }}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            value={row.payeeEntityName || ""}
                            onChange={(e) => {
                              const updated = [...errors];
                              const rowCopy = {
                                ...updated[index],
                                payeeEntityName: e.target.value,
                              };
                              rowCopy.issues = revalidateRow(rowCopy);

                              if (rowCopy.issues.length === 0) {
                                updated.splice(index, 1);
                                onErrorsUpdated && onErrorsUpdated(updated);
                                setValidRows([...validRows, rowCopy]);
                                tcpService
                                  .patchRecord(rowCopy.id, rowCopy)
                                  .catch((err) => {
                                    console.error(
                                      "Failed to patch record:",
                                      err
                                    );
                                  });
                              } else {
                                updated[index] = rowCopy;
                                onErrorsUpdated && onErrorsUpdated(updated);
                              }
                            }}
                            style={{ width: "100%" }}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            value={row.payeeEntityAbn || ""}
                            onChange={(e) => {
                              const updated = [...errors];
                              const rowCopy = {
                                ...updated[index],
                                payeeEntityAbn: e.target.value,
                              };
                              rowCopy.issues = revalidateRow(rowCopy);

                              if (rowCopy.issues.length === 0) {
                                updated.splice(index, 1);
                                onErrorsUpdated && onErrorsUpdated(updated);
                                setValidRows([...validRows, rowCopy]);
                                tcpService
                                  .patchRecord(rowCopy.id, rowCopy)
                                  .catch((err) => {
                                    console.error(
                                      "Failed to patch record:",
                                      err
                                    );
                                  });
                              } else {
                                updated[index] = rowCopy;
                                onErrorsUpdated && onErrorsUpdated(updated);
                              }
                            }}
                            style={{ width: "100%" }}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            value={row.paymentAmount || ""}
                            onChange={(e) => {
                              const updated = [...errors];
                              const rowCopy = {
                                ...updated[index],
                                paymentAmount: e.target.value,
                              };
                              rowCopy.issues = revalidateRow(rowCopy);

                              if (rowCopy.issues.length === 0) {
                                updated.splice(index, 1);
                                onErrorsUpdated && onErrorsUpdated(updated);
                                setValidRows([...validRows, rowCopy]);
                                tcpService
                                  .patchRecord(rowCopy.id, rowCopy)
                                  .catch((err) => {
                                    console.error(
                                      "Failed to patch record:",
                                      err
                                    );
                                  });
                              } else {
                                updated[index] = rowCopy;
                                onErrorsUpdated && onErrorsUpdated(updated);
                              }
                            }}
                            style={{ width: "100%" }}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            value={row.paymentDate || ""}
                            onChange={(e) => {
                              const updated = [...errors];
                              const rowCopy = {
                                ...updated[index],
                                paymentDate: e.target.value,
                              };
                              rowCopy.issues = revalidateRow(rowCopy);

                              if (rowCopy.issues.length === 0) {
                                updated.splice(index, 1);
                                onErrorsUpdated && onErrorsUpdated(updated);
                                setValidRows([...validRows, rowCopy]);
                                tcpService
                                  .patchRecord(rowCopy.id, rowCopy)
                                  .catch((err) => {
                                    console.error(
                                      "Failed to patch record:",
                                      err
                                    );
                                  });
                              } else {
                                updated[index] = rowCopy;
                                onErrorsUpdated && onErrorsUpdated(updated);
                              }
                            }}
                            style={{ width: "100%" }}
                          />
                        </TableCell>
                        <TableCell>
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {row.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                          <TableCell>{row.paymentDate}</TableCell>
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
