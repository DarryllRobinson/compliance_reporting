import React, { useState, useEffect } from "react";
import { xeroService } from "../../../services/xero.service";
import ReviewRecords from "./ReviewRecords";
import { Box, TextField, Button, Typography } from "@mui/material";
import { userService } from "../../../services/user.service";
import { useAlert, useReportContext } from "../../../context";
import { ptrsService } from "../../../services/ptrs.service";
import { fieldMapping } from "./fieldMapping"; // Import the field mapping

export default function ConnectExternalSystems() {
  const { reportDetails } = useReportContext();
  const { sendAlert } = useAlert();
  const [credentials, setCredentials] = useState({
    clientId: "",
    clientSecret: "",
  });
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await xeroService.connect(credentials);
      if (response.success) {
        setIsConnected(true);
      } else {
        console.error("Failed to connect to Xero.");
      }
    } catch (error) {
      console.error("Error connecting to Xero:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapRecordKeys = (records) => {
    // Create a mapping object from fieldMapping for quick lookup
    const keyMapping = fieldMapping.reduce((acc, field) => {
      //   console.log("Field Mapping:", field);
      //   console.log("Field Name:", field.name);
      //   console.log("Field Label:", field.label);

      acc[field.label] = field.name;
      //   console.log("acc[field.label]:", acc[field.label]);
      return acc;
    }, {});

    console.log("Key Mapping:", keyMapping);

    // Iterate through each record and replace keys
    return records.map((record) => {
      const mappedRecord = {};
      Object.keys(record).forEach((key, index) => {
        console.log("index:", index);
        console.log("Record:", record);
        console.log("Original Key:", key);
        console.log("Original Value:", record[key]);
        console.log("Mapped Key:", keyMapping[index]);
        console.log("Mapped Value:", record[key]);
        const newKey = keyMapping[key] || key; // Use the mapped key or fallback to the original key
        mappedRecord[newKey] = record[key];
      });
      return mappedRecord;
    });
  };

  useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      xeroService
        .fetchData()
        .then((data) => {
          const mappedRecords = mapRecordKeys(data); // Map the record keys
          setRecords(mappedRecords);
          //   console.log("Mapped Records:", mappedRecords);

          // Save the mapped records to the database
          return ptrsService.create({ records: mappedRecords });
        })
        .then((response) => {
          if (response.success) {
            sendAlert("success", "Records saved successfully.");
          } else {
            sendAlert("error", "Failed to save records.");
          }
        })
        .catch((error) => {
          console.error("Error saving records:", error);
          sendAlert("error", error.message || "Error saving records.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isConnected, reportDetails.reportId, sendAlert]);

  const handleSave = async (tcpRecords) => {
    console.log("TCP Records:", tcpRecords);
    console.log("Report Context:", reportDetails);
    // Save the TCP records
    // try {
    //   tcpRecords = {
    //     ...tcpRecords,
    //     updatedBy: userService.userValue.userId,
    //     reportId: reportDetails.reportId,
    //   };
    //   ptrsService
    //     .create(tcpRecords)
    //     .then((response) => {
    //       if (response.success) {
    //         sendAlert("success", "Records saved successfully.");
    //       } else {
    //         sendAlert("error", "Failed to save records.");
    //       }
    //     })
    //     .catch((error) => {
    //       sendAlert("error", error || "Error saving records:");
    //     });
    // } catch (error) => {
    //   sendAlert("error", error || "Error saving records:");
    // }

    // Pass them to the next step
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isConnected) {
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
        <Button variant="contained" color="primary" onClick={handleConnect}>
          Connect
        </Button>
      </Box>
    );
  }

  return <ReviewRecords records={records} onSave={handleSave} />;
}
