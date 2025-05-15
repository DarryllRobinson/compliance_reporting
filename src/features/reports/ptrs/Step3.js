import React, { useState } from "react";
import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router";
import { tcpService } from "../../../services";
import { useAlert } from "../../../context";
import { Download, Upload, OpenInNew } from "@mui/icons-material";
import { formatDateForMySQL } from "../../../utils/formatDate";

export default function Step3({
  savedRecords = [],
  tcpDataset = [],
  onNext,
  onBack,
  reportId,
  reportStatus,
}) {
  const navigate = useNavigate();
  const { sendAlert } = useAlert();
  // Use savedRecords or tcpDataset as appropriate for the dataset
  const dataset =
    tcpDataset && tcpDataset.length > 0 ? tcpDataset : savedRecords;
  const [uploadedFile, setUploadedFile] = useState(null);
  const [downloadedFile, setDownloadedFile] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Track successful upload

  const isLocked = reportStatus === "Submitted";

  const handleDownload = async () => {
    // Extract only the payerEntityAbn field
    const csvHeaders = "Payee Entity ABN";
    const csvRows = dataset.map((record) => `"${record.payeeEntityAbn}"`);
    const csvContent = [csvHeaders, ...csvRows].join("\n");

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv" });
    let today = new Date();
    const dateString = today.toISOString().split("T")[0];
    const fileName = `tcp_dataset_${dateString}.csv`;
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: "CSV Files",
          accept: { "text/csv": [".csv"] },
        },
      ],
    });

    const writableStream = await fileHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
    setDownloadedFile(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const validateCsvFile = async (file) => {
    const errors = [];
    const text = await file.text();
    const rows = text.split("\n").map((row) => row.trim());

    const chunkSize = 1000; // Process rows in chunks
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      chunk.forEach((row, index) => {
        const globalIndex = i + index;
        if (globalIndex === 0) {
          if (row !== "Payee Entity ABN") {
            errors.push(
              `Row ${globalIndex + 1}: Header must be "Payee Entity ABN".`
            );
          }
          return;
        }

        if (!row) return;

        const fields = row.split(",");
        if (fields.length !== 1) {
          errors.push(
            `Row ${globalIndex + 1}: Must contain exactly one field.`
          );
        } else if (!/^\d{11}$/.test(fields[0].trim())) {
          errors.push(
            `Row ${globalIndex + 1}: Value "${fields[0]}" must be an 11-digit number.`
          );
        }
      });
    }

    if (rows.length <= 1) {
      errors.push("The file must contain at least one valid data row.");
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      sendAlert("warning", "Please upload a file.");
      return;
    }

    try {
      const errors = await validateCsvFile(uploadedFile);
      if (errors.length > 0) {
        sendAlert("error", `Validation failed:\n${errors.join("\n")}`);
        return;
      }

      // Collect valid rows (excluding the header row)
      const text = await uploadedFile.text();
      const rows = text
        .split("\n")
        .filter((row, index) => row.trim() && index > 0); // Exclude header and empty rows

      const validRecords = rows.map((row) => {
        const payeeEntityAbn = row.trim(); // Extract the ABN
        return {
          payeeEntityAbn,
          // Placeholder for future: e.g., paymentDate: formatDateForMySQL(record.paymentDate)
        };
      });

      // Send valid records to the backend
      try {
        await tcpService.sbiUpdate(reportId, validRecords);
        sendAlert(
          "success",
          `File uploaded successfully! ${validRecords.length} records were uploaded and processed.`
        );
        setIsFileUploaded(true); // Mark file as successfully uploaded
      } catch (error) {
        console.error("Error updating backend:", error);
        sendAlert(
          "error",
          "Failed to update the backend with the uploaded records."
        );
      }
    } catch (error) {
      console.error("Error validating file:", error);
      sendAlert("error", "An unexpected error occurred during validation.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {isLocked && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This report has already been submitted and cannot be edited.
        </Alert>
      )}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Step 3: Upload Comparison File
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        In this step, you need to download the TCP dataset and upload it to the
        SBI tool on the regulator's portal. The SBI tool will compare the ABNs
        in the dataset to the list of business ABNs that the regulator has
        judged to be not small businesses. After running the comparison, upload
        the resulting CSV file here to exclude the relevant TCP records from the
        rest of the process.
      </Typography>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Download TCP Dataset
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          startIcon={<Download />}
          disabled={isLocked}
        >
          Download TCP Dataset
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            window.open("https://portal.paymenttimes.gov.au/", "_blank")
          }
          sx={{ marginLeft: 2 }}
          disabled={!downloadedFile || isLocked}
          endIcon={<OpenInNew />}
        >
          PTRS Portal
        </Button>
      </Paper>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Upload Comparison File
        </Typography>
        <Button
          variant="contained"
          component="label"
          sx={{ marginBottom: 2 }}
          startIcon={<Upload />}
          disabled={isLocked}
        >
          Upload SBI File
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isLocked}
          />
        </Button>
        {uploadedFile && (
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            Uploaded File: {uploadedFile.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={!uploadedFile || isLocked}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={async () => {
            if (onNext) {
              onNext();
            } else {
              navigate(`/reports/ptrs/step4/${reportId}`);
            }
          }}
          disabled={!isFileUploaded || isLocked} // Disable until file is successfully uploaded or locked
        >
          Next: Step 4
        </Button>
      </Paper>
    </Box>
  );
}
