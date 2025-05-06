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
import { useLoaderData, useNavigate, useParams } from "react-router";
import { tcpService, userService } from "../../../services";
import {
  calculatePartialPayment,
  calculatePaymentTerm,
} from "../../../calculations/ptrs"; // Import the function
import { getRowHighlightColor } from "../../../utils/highlightRow";
import { inputValidationRules } from "../../../utils/inputValidation";

const calculatePartialPaymentsForBatch = (records) => {
  // Group payments by invoiceReferenceNumber
  const groupedPayments = records.reduce((acc, record) => {
    const key = record.invoiceReferenceNumber;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({
      amount: record.paymentAmount,
      date: record.paymentDate,
      id: record.id,
      invoiceReferenceNumber: record.invoiceReferenceNumber,
    });
    return acc;
  }, {});

  // Calculate partialPayment for each record
  return records.map((record) => {
    const payments = groupedPayments[record.invoiceReferenceNumber] || [];

    // Call calculatePartialPayment for each record
    const { partialPayment, invoiceReferenceNumber } = calculatePartialPayment(
      record.paymentAmount,
      record.invoiceAmount,
      payments
    );

    return {
      ...record,
      partialPayment,
      invoiceReferenceNumber,
    };
  });
};

export async function step2Loader({ params, location }) {
  const { reportId } = params;
  const passedRecords = location?.state?.records;

  const savePartialPaymentRecords = async (records) => {
    // Changing to be able to save all records
    // const partialPaymentRecords = records.filter(
    //   (record) => record.partialPayment
    // );

    if (records.length > 0) {
      try {
        // console.log("Saving partial payment records:", records);
        records.map((record) => ({
          ...records,
          id: record.id,
          partialPayment: record.partialPayment,
          updatedBy: userService.userValue.id,
        }));
        await tcpService.bulkUpdate(records);
      } catch (error) {
        console.error("Error saving partial payment records:", error);
        throw new Response("Failed to save partial payment records", {
          status: 500,
        });
      }
    }
  };

  if (passedRecords) {
    // Update paymentTerm and partialPayment for the batch of records
    const updatedRecords = calculatePartialPaymentsForBatch(
      passedRecords.map((record) => ({
        ...record,
        paymentTerm: calculatePaymentTerm({
          contractPoPaymentTerms: record.contractPoPaymentTerms,
          invoicePaymentTerms: record.invoicePaymentTerms,
          invoiceIssueDate: record.invoiceIssueDate,
          invoiceDueDate: record.invoiceDueDate,
        }),
      }))
    );

    await savePartialPaymentRecords(updatedRecords);
    return { records: updatedRecords };
  }

  try {
    const fetchedRecords = await tcpService.getAllByReportId(reportId);

    // Update paymentTerm and partialPayment for the batch of records
    const updatedRecords = calculatePartialPaymentsForBatch(
      fetchedRecords.map((record) => ({
        ...record,
        paymentTerm: calculatePaymentTerm({
          contractPoPaymentTerms: record.contractPoPaymentTerms,
          invoicePaymentTerms: record.invoicePaymentTerms,
          invoiceIssueDate: record.invoiceIssueDate,
          invoiceDueDate: record.invoiceDueDate,
        }),
      }))
    );

    await savePartialPaymentRecords(updatedRecords);
    return { records: updatedRecords || [] };
  } catch (error) {
    console.error("Error fetching records:", error);
    throw new Response("Failed to fetch records", { status: 500 });
  }
}

export default function Step2() {
  const params = useParams();
  const { reportId } = params; // Extract reportId from route params
  const { sendAlert } = useAlert();
  const navigate = useNavigate();
  const { records: savedRecords } = useLoaderData();
  // console.log("Saved records:", savedRecords);
  const [filteredRecords, setFilteredRecords] = useState(
    savedRecords.filter((record) => record.isTcp) // Filter records with isTcp = true
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [changedRows, setChangedRows] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = false; // Initialize rows as unchanged
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
  const [showPartialPaymentsOnly, setShowPartialPaymentsOnly] = useState(false);

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
          setFields((prev) =>
            rowsToSave.reduce(
              (acc, row) => {
                acc[row.id] = {
                  ...prev[row.id],
                  updatedAt: new Date().toISOString(), // Update the updatedAt timestamp
                };
                return acc;
              },
              { ...prev }
            )
          );
          setValidationErrors({});
        } else {
          throw new Error("Save failed");
        }
      } catch (error) {
        console.error("Error saving changed records:", error);
        setChangedRows((prev) =>
          rowsToSave.reduce(
            (acc, row) => {
              acc[row.id] = "error"; // Mark rows with save errors
              return acc;
            },
            { ...prev }
          )
        );
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

      // Apply validation based on inputValidationRules
      const validationRule = inputValidationRules[field];
      if (validationRule) {
        const fieldName = validationRule.headerName || field; // Use headerName if available
        if (validationRule.type === "number" && isNaN(value)) {
          sendAlert("error", `${fieldName} must be a number.`);
          return prev; // Reject invalid input
        }
        if (
          validationRule.type === "integer" &&
          (!Number.isInteger(+value) ||
            value < validationRule.min ||
            value > validationRule.max)
        ) {
          sendAlert(
            "error",
            `${fieldName} must be an integer between ${validationRule.min} and ${validationRule.max}.`
          );
          return prev; // Reject invalid input
        }
        if (validationRule.pattern && !validationRule.pattern.test(value)) {
          sendAlert("error", `${fieldName} contains invalid characters.`);
          return prev; // Reject invalid input
        }
      }

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

      // Check if the field value has changed compared to the original record
      const originalRecord = savedRecords.find((record) => record.id === id);
      const originalValue = originalRecord?.[field];
      const originalCreditCardNumber = originalRecord?.creditCardNumber || "";
      const originalCreditCardPayment =
        originalRecord?.creditCardPayment || false;

      const isCreditCardNumberChanged =
        field === "creditCardNumber" &&
        (value !== originalCreditCardNumber ||
          updatedFields[id].creditCardPayment !== originalCreditCardPayment);

      const isChanged = isCreditCardNumberChanged || value !== originalValue;

      setChangedRows((prev) => ({
        ...prev,
        [id]: isChanged ? "unsaved" : false, // Mark as unsaved if changed, otherwise reset
      }));

      return updatedFields;
    });
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

  const togglePartialPaymentsFilter = () => {
    setShowPartialPaymentsOnly((prev) => !prev);
  };

  const filteredRecordsToDisplay = showPartialPaymentsOnly
    ? (() => {
        // Identify all invoiceReferenceNumbers with at least one partial payment
        const invoicesWithPartialPayments = new Set(
          filteredRecords
            .filter((record) => record.partialPayment)
            .map((record) => record.invoiceReferenceNumber)
        );

        // Include all payments associated with those invoices
        const relevantRecords = filteredRecords.filter((record) =>
          invoicesWithPartialPayments.has(record.invoiceReferenceNumber)
        );

        // Sort by invoiceReferenceNumber and then paymentDate
        return relevantRecords.sort((a, b) => {
          if (a.invoiceReferenceNumber === b.invoiceReferenceNumber) {
            return new Date(a.paymentDate) - new Date(b.paymentDate);
          }
          return a.invoiceReferenceNumber.localeCompare(
            b.invoiceReferenceNumber
          );
        });
      })()
    : filteredRecords;

  const displayedRecords = filteredRecordsToDisplay.slice(
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
      <Button
        variant="contained"
        color="primary"
        onClick={togglePartialPaymentsFilter}
        sx={{ marginBottom: 2 }}
      >
        {showPartialPaymentsOnly
          ? "Show All Payments"
          : "Show Partial Payments Only"}
      </Button>
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
                "Invoice Amount",
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
                  backgroundColor: getRowHighlightColor(
                    record,
                    changedRows,
                    showPartialPaymentsOnly // Ensure the filter state is passed to highlight partial payments in blue
                  ),
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
                <TableCell>{record.invoiceAmount || "-"}</TableCell>
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
                    sx={{ width: "70px" }} // Make the field wide enough for 3 digits
                    inputProps={{ maxLength: 3, min: 0, max: 999 }}
                    value={fields[record.id]?.paymentTerm || 0}
                    onChange={(e) =>
                      handleFieldChange(
                        record.id,
                        "paymentTerm",
                        parseInt(e.target.value, 10) || 0
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
        count={filteredRecordsToDisplay.length}
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
            navigate(`/reports/ptrs/step3/${reportId}`);
          }}
        >
          Next: Step 3
        </Button>
      </Box>
    </Box>
  );
}
