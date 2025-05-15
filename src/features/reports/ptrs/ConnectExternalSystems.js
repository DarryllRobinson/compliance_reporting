import React, { useState, useCallback } from "react";
import { tcpService, userService, xeroService } from "../../../services";
import { Box, TextField, Button, Typography } from "@mui/material";
import {} from "../../../services/user.service";
import { useAlert, useReportContext } from "../../../context";
import { fieldMapping } from "./fieldMapping"; // Import the field mapping
import { useNavigate } from "react-router"; // Import useNavigate

export default function ConnectExternalSystems() {
  const { reportDetails } = useReportContext();
  const { sendAlert } = useAlert();
  const navigate = useNavigate(); // Initialize navigate
  const [credentials, setCredentials] = useState({
    clientId: "",
    clientSecret: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await xeroService.connect(credentials);
      if (response.success) {
        const fetchedData = await xeroService.fetchData(); // Fetch data from Xero
        const mappedRecords = mapRecordKeys(fetchedData); // Map the record keys

        // Save the mapped records to the backend
        const saveResponse = await tcpService.bulkCreate(mappedRecords);
        if (saveResponse.success) {
          sendAlert("success", "Records saved successfully.");
        } else {
          sendAlert("error", "Failed to save records to the backend.");
          return;
        }

        // Navigate to ReviewRecords with the fetched records
        navigate(`/reports/ptrs/step1/${reportDetails.reportId}`, {
          state: { savedRecords: mappedRecords },
        });
      } else {
        sendAlert("error", "Failed to connect to Xero.");
      }
    } catch (error) {
      console.error("Error connecting to Xero or saving data:", error);
      sendAlert("error", "An error occurred while connecting or saving data.");
    } finally {
      setIsLoading(false);
    }
  };

  const mapRecordKeys = useCallback(
    (records) => {
      // Create a mapping object from fieldMapping for quick lookup
      const keyMapping = fieldMapping.reduce((acc, field) => {
        acc[field.label.toLowerCase()] = field.name; // Convert label to lowercase
        return acc;
      }, {});

      // List of fields to clean
      const numericFields = [
        "payerEntityAbn",
        "payerEntityAcnArbn",
        "payeeEntityAbn",
        "payeeEntityAcnArbn",
      ];
      const dateFields = [
        "supplyDate",
        "paymentDate",
        "invoiceIssueDate",
        "invoiceReceiptDate",
        "invoiceDueDate",
        "noticeForPaymentIssueDate",
      ];

      // Iterate through each record and replace keys
      return records.map((record) => {
        let mappedRecord = {};
        Object.keys(record).forEach((key) => {
          const newKey = keyMapping[key.toLowerCase()] || key; // Convert key to lowercase for comparison
          mappedRecord[newKey] = record[key];
        });

        // Force numeric conversion for numeric fields
        numericFields.forEach((field) => {
          const raw = mappedRecord[field];
          const cleaned =
            typeof raw === "string"
              ? parseInt(raw.trim().replace(/[^0-9]/g, ""), 10)
              : typeof raw === "number"
                ? raw
                : null;
          mappedRecord[field] = isNaN(cleaned) ? null : cleaned;
        });

        // Convert paymentAmount to a number
        if (mappedRecord.paymentAmount) {
          mappedRecord.paymentAmount = parseFloat(
            mappedRecord.paymentAmount.toString().replace(/[^0-9.-]+/g, "")
          );
        }

        // Validate and format all date fields
        dateFields.forEach((field) => {
          if (mappedRecord[field]) {
            const [day, month, year] = mappedRecord[field].split("/"); // Split DD/MM/YYYY
            const formattedDate = new Date(`${year}-${month}-${day}`); // Convert to YYYY-MM-DD
            if (!isNaN(formattedDate.getTime())) {
              mappedRecord[field] = formattedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
            } else {
              console.warn(`Invalid ${field}:`, mappedRecord[field]);
              mappedRecord[field] = null; // Set to null if invalid
            }
          }
        });

        // Add additional fields
        mappedRecord = {
          ...mappedRecord,
          createdBy: userService.userValue.id,
          reportId: reportDetails.reportId,
        };

        return mappedRecord;
      });
    },
    [reportDetails.reportId]
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Connect to External Data Source
      </Typography>
      <TextField
        label="Client ID"
        name="clientId"
        fullWidth
        value={credentials.clientId}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Client Secret"
        name="clientSecret"
        fullWidth
        type="password"
        value={credentials.clientSecret}
        onChange={handleInputChange}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Connect and Fetch Data"}
      </Button>
    </Box>
  );
}
