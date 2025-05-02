import React, { useState } from "react";
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
} from "@mui/material";
import { useAlert } from "../../../context";
import { useLoaderData, useNavigate } from "react-router";
import { tcpService, userService } from "../../../services";

export async function stepTwoLoader({ params, location }) {
  const { reportId } = params;
  const passedRecords = location?.state?.records;

  if (passedRecords) {
    return { records: passedRecords };
  }

  try {
    const fetchedRecords = await tcpService.getAllByReportId(reportId);
    console.log("Fetched records:", fetchedRecords);
    return { records: fetchedRecords || [] };
  } catch (error) {
    console.error("Error fetching records:", error);
    throw new Response("Failed to fetch records", { status: 500 });
  }
}

export default function StepTwo() {
  const { sendAlert } = useAlert();
  const navigate = useNavigate();
  const { records: savedRecords } = useLoaderData();
  const [filteredRecords, setFilteredRecords] = useState(
    savedRecords.filter((record) => record.isTcp) // Filter records with isTcp = true
  );
  const [searchTerm, setSearchTerm] = useState("");
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

  const [fields, setFields] = useState(() =>
    savedRecords.reduce((acc, record) => {
      if (record.isTcp) {
        acc[record.id] = {
          peppolEnabled: record.peppolEnabled || false,
          rcti: record.rcti || false,
          creditCardPayment: record.creditCardPayment || false,
          creditCardNumber: record.creditCardNumber || "",
          partialPayment: record.partialPayment || false,
          paymentTerm: record.paymentTerm || 0,
          notes: record.notes || "",
          excludedTcp: record.excludedTcp || false, // Add excludedTcp field
        };
      }
      return acc;
    }, {})
  );

  const [validationErrors, setValidationErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const validateCreditCardNumber = (id) => {
    const isCreditCardPayment = fields[id]?.creditCardPayment || false;
    const creditCardNumber = fields[id]?.creditCardNumber || "";
    if (isCreditCardPayment) {
      if (!creditCardNumber.trim()) {
        return "Credit card number is required when credit card payment is selected.";
      }
      if (!/^\d{16}$/.test(creditCardNumber)) {
        return "Credit card number must be exactly 16 digits.";
      }
    }
    return "";
  };

  const saveChangedRows = async () => {
    const rowsToSave = filteredRecords.filter(
      (record) => changedRows[record.id] === "unsaved"
    );

    const errors = {};
    rowsToSave.forEach((record) => {
      const error = validateCreditCardNumber(record.id);
      if (error) {
        errors[record.id] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      sendAlert("error", "Please fix validation errors before saving.");
      return;
    }

    if (rowsToSave.length > 0) {
      const updatedRecords = rowsToSave.map((record) => ({
        id: record.id,
        ...record,
        ...fields[record.id], // Include excludedTcp in the save object
        updatedBy: userService.userValue.id,
      }));

      try {
        console.log("Saving updated records:", updatedRecords);
        const response = await tcpService.bulkUpdate(updatedRecords);
        if (response.success) {
          sendAlert("success", "Changed records saved successfully.");
          setChangedRows((prev) =>
            rowsToSave.reduce(
              (acc, row) => {
                acc[row.id] = "saved"; // Mark saved rows as successfully saved
                return acc;
              },
              { ...prev }
            )
          );
          setValidationErrors({});
        } else {
          sendAlert("error", "Failed to save changed records.");
        }
      } catch (error) {
        console.error("Error saving changed records:", error);
        sendAlert("error", "An error occurred while saving changed records.");
      }
    }
  };

  const handleFieldChange = (id, field, value) => {
    setFields((prev) => {
      const updatedFields = {
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      };

      // Automatically set creditCardPayment to true if creditCardNumber has a value
      if (field === "creditCardNumber") {
        updatedFields[id].creditCardPayment = value.trim() ? true : false;
      }

      // Ensure paymentTerm is a positive integer with a maximum of three digits
      if (field === "paymentTerm") {
        const sanitizedValue = Math.max(
          0,
          Math.min(999, parseInt(value, 10) || 0)
        );
        updatedFields[id].paymentTerm = sanitizedValue;
      }

      return updatedFields;
    });

    setChangedRows((prev) => ({
      ...prev,
      [id]: "unsaved", // Mark the row as unsaved
    }));
  };

  const handleSearch = (event) => {
    const lowerCaseSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(lowerCaseSearchTerm);
    setFilteredRecords(
      savedRecords
        .filter((record) => record.isTcp) // Ensure only isTcp = true records are filtered
        .filter((record) =>
          Object.values(record)
            .join(" ")
            .toLowerCase()
            .includes(lowerCaseSearchTerm)
        )
    );
  };

  const displayedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = async (event, newPage) => {
    await saveChangedRows();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Step 2: Capture Additional Details
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ marginBottom: 2 }}
      />
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "Payer Entity Name",
                "Payer Entity ABN",
                "Payer Entity ACN/ARBN",
                "Payee Entity Name",
                "Payee Entity ABN",
                "Payee Entity ACN/ARBN",
                "Payment Amount",
                "Description",
                "Supply Date",
                "Payment Date",
                "Contract PO Reference Number",
                "Contract PO Payment Terms",
                "Notice for Payment Issue Date",
                "Notice for Payment Terms",
                "Invoice Reference Number",
                "Invoice Issue Date",
                "Invoice Receipt Date",
                "Invoice Payment Terms",
                "Invoice Due Date",
                "Peppol eInvoice Enabled",
                "RCTI",
                "Credit Card Payment",
                "Credit Card Number",
                "Partial Payment",
                "Payment Term",
                "Excluded TCP", // Add Excluded TCP to the table header
                "Notes",
              ].map((label, index) => (
                <TableCell key={index}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  backgroundColor:
                    changedRows[record.id] === "unsaved"
                      ? "rgba(255, 0, 0, 0.1)" // Highlight unsaved rows in red
                      : changedRows[record.id] === "saved"
                        ? "rgba(0, 255, 0, 0.1)" // Highlight saved rows in green
                        : "inherit",
                }}
              >
                <TableCell>{record.payerEntityName || "-"}</TableCell>
                <TableCell>{record.payerEntityAbn || "-"}</TableCell>
                <TableCell>{record.payerEntityAcnArbn || "-"}</TableCell>
                <TableCell>{record.payeeEntityName || "-"}</TableCell>
                <TableCell>{record.payeeEntityAbn || "-"}</TableCell>
                <TableCell>{record.payeeEntityAcnArbn || "-"}</TableCell>
                <TableCell>{record.paymentAmount || "-"}</TableCell>
                <TableCell>{record.description || "-"}</TableCell>
                <TableCell>{record.supplyDate || "-"}</TableCell>
                <TableCell>{record.paymentDate || "-"}</TableCell>
                <TableCell>{record.contractPoReferenceNumber || "-"}</TableCell>
                <TableCell>{record.contractPoPaymentTerms || "-"}</TableCell>
                <TableCell>{record.noticeForPaymentIssueDate || "-"}</TableCell>
                <TableCell>{record.noticeForPaymentTerms || "-"}</TableCell>
                <TableCell>{record.invoiceReferenceNumber || "-"}</TableCell>
                <TableCell>{record.invoiceIssueDate || "-"}</TableCell>
                <TableCell>{record.invoiceReceiptDate || "-"}</TableCell>
                <TableCell>{record.invoicePaymentTerms || "-"}</TableCell>
                <TableCell>{record.invoiceDueDate || "-"}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={fields[record.id]?.peppolEnabled || false}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id,
                        "peppolEnabled",
                        e.target.checked
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={fields[record.id]?.rcti || false}
                    onChange={(e) =>
                      handleFieldChange(record.id, "rcti", e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={fields[record.id]?.creditCardPayment || false}
                    disabled={!!fields[record.id]?.creditCardNumber.trim()} // Disable if creditCardNumber has a value
                    onChange={(e) =>
                      handleFieldChange(
                        record.id,
                        "creditCardPayment",
                        e.target.checked
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputProps={{ maxLength: 16 }} // Restrict input to 16 characters
                    sx={{ width: "250px" }} // Make the field wide enough for 16 digits
                    error={!!validationErrors[record.id]}
                    helperText={validationErrors[record.id] || ""}
                    value={fields[record.id]?.creditCardNumber || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id,
                        "creditCardNumber",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={fields[record.id]?.partialPayment || false}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id,
                        "partialPayment",
                        e.target.checked
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="number"
                    fullWidth
                    inputProps={{ maxLength: 3, min: 0, max: 999 }}
                    value={fields[record.id]?.paymentTerm || 0}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id,
                        "paymentTerm",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={fields[record.id]?.excludedTcp || false}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id,
                        "excludedTcp",
                        e.target.checked
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    sx={{ width: "400px" }} // Make the notes field wider
                    value={fields[record.id]?.notes || ""}
                    onChange={(e) =>
                      handleFieldChange(record.id, "notes", e.target.value)
                    }
                  />
                </TableCell>
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
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={saveChangedRows}
          sx={{ marginRight: 2 }}
        >
          Save All Changes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={async () => {
            await saveChangedRows();
            navigate("/reports/ptrs/step3");
          }}
        >
          Next: Step 3
        </Button>
      </Box>
    </Box>
  );
}
