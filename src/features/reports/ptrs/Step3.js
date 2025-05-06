import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { tcpService } from "../../../services";
import { useAlert } from "../../../context";
import { Download, Upload, OpenInNew } from "@mui/icons-material";

export async function step3Loader({ params }) {
  const { reportId } = params;

  try {
    // Fetch TCP dataset where excludedTcp = false and isTcp = true
    // Filtered at the backend too just to make sure
    const tcpDataset = await tcpService.getTcpByReportId(reportId);
    const filteredDataset = tcpDataset.filter(
      (record) => record.isTcp && !record.excludedTcp
    );

    return { tcpDataset: filteredDataset };
  } catch (error) {
    console.error("Error fetching TCP dataset:", error);
    throw new Response("Failed to fetch TCP dataset", { status: 500 });
  }
}

export default function Step3() {
  const navigate = useNavigate();
  const params = useParams();
  const { sendAlert } = useAlert();
  const { reportId } = params; // Extract reportId from route params
  const { tcpDataset } = useLoaderData();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [downloadedFile, setDownloadedFile] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Track successful upload

  const handleDownload = async () => {
    // Extract only the payerEntityAbn field
    const csvHeaders = "Payee Entity ABN";
    const csvRows = tcpDataset.map((record) => `"${record.payeeEntityAbn}"`);
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

    rows.forEach((row, index) => {
      if (index === 0) {
        // Validate header row
        if (row !== "Payee Entity ABN") {
          errors.push(`Row ${index + 1}: Header must be "Payee Entity ABN".`);
        }
        return;
      }

      if (!row) {
        // Skip empty rows
        return;
      }

      const fields = row.split(",");
      if (fields.length !== 1) {
        errors.push(`Row ${index + 1}: Must contain exactly one field.`);
      } else if (!/^\d{11}$/.test(fields[0].trim())) {
        errors.push(
          `Row ${index + 1}: Value "${fields[0]}" must be an 11-digit number.`
        );
      }
    });

    // Check if the file contains at least one valid data row
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
        return { payeeEntityAbn }; // Create an object with the ABN
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
          disabled={!downloadedFile}
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
        >
          Upload SBI File
          <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
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
          disabled={!uploadedFile}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={async () => {
            navigate(`/reports/ptrs/step4/${reportId}`);
          }}
          disabled={!isFileUploaded} // Disable until file is successfully uploaded
        >
          Next: Step 4
        </Button>
      </Paper>
    </Box>
  );
}
