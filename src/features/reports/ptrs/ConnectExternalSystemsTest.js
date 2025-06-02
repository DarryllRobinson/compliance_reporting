import { useState, useCallback, useEffect } from "react";
import { tcpService, userService, xeroService } from "../../../services";
import { Box, Button, Typography, Snackbar } from "@mui/material";
import { fieldMapping } from "./fieldMapping";
import { useLocation } from "react-router";

export default function ConnectExternalSystemsTest() {
  const { state } = useLocation();
  const reportDetails = state?.reportDetails || {};
  const [progressMessage, setProgressMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    setProgressMessage("Connecting to Xero...");
    try {
      const data = await xeroService.connect({
        reportId: "Z2lH58qtri", // hardcoded for testing reportDetails.reportId,
      });

      const authUrl = data.authUrl;
      if (!authUrl) {
        throw new Error("Authorisation URL not provided by server");
      }

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting to Xero:", error);
      setProgressMessage("Error occurred while connecting to Xero.");
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

        // Add additional logic before returning mappedRecord
        const hasAbn = !!mappedRecord.payeeEntityAbn;
        const hasName = !!mappedRecord.payeeName || !!mappedRecord.supplierName;
        mappedRecord.requiresAttention = !(hasAbn && hasName);

        // Basic system recommendation logic (expand as needed)
        const desc = (mappedRecord.description || "").toLowerCase();
        const name = (
          mappedRecord.payeeName ||
          mappedRecord.supplierName ||
          ""
        ).toLowerCase();
        const exclusionKeywords = [
          "wages",
          "salary",
          "payroll",
          "superannuation",
        ];

        mappedRecord.systemRecommendation = !exclusionKeywords.some(
          (keyword) => desc.includes(keyword) || name.includes(keyword)
        );

        mappedRecord.isTcp = true;

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
      <Button
        variant="contained"
        color="primary"
        onClick={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Connect and Fetch Data"}
      </Button>

      <Snackbar
        open={!!progressMessage}
        message={progressMessage}
        autoHideDuration={3000}
        onClose={() => setProgressMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
