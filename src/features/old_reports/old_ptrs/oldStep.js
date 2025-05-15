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
  useTheme,
} from "@mui/material";
import { useAlert } from "../../../context";
import { fieldMapping } from "./fieldMapping"; // Import fieldMapping
import { useLoaderData, useNavigate, useParams } from "react-router"; // Import useNavigate
import { tcpService, userService } from "../../../services";
import { getRowHighlightColor } from "../../../utils/highlightRow";

export async function step1Loader({ params }) {
  const { reportId } = params; // Extract reportId from route params
  try {
    const savedRecords = await tcpService.getAllByReportId(reportId); // Fetch records by reportId
    // console.log("Fetched records:", savedRecords); // Debug log to check the structure of savedRecords
    return { savedRecords: savedRecords || [] }; // Return saved records or an empty array
  } catch (error) {
    console.error("Error fetching records:", error);
    throw new Response("Failed to fetch records", { status: 500 });
  }
}

export default function Step1() {
  const params = useParams();
  const { reportId } = params; // Extract reportId from route params
  const theme = useTheme();
  const { sendAlert } = useAlert();
  const navigate = useNavigate();
  const { savedRecords } = useLoaderData();
  const [records, setRecords] = useState(savedRecords);
  const [filteredRecords, setFilteredRecords] = useState(savedRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [tcpStatus, setTcpStatus] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.isTcp || false;
      return acc;
    }, {})
  );
  const [tcpExclusions, setTcpExclusions] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.tcpExclusion || "";
      return acc;
    }, {})
  );
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
      acc[record.id] = {
        paymentTerm: record.paymentTerm || 0,
      };
      return acc;
    }, {})
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const saveChangedRows = async () => {
    // Filter records that are marked as "unsaved"
    const rowsToSave = records.filter(
      (record) => changedRows[record.id] === "unsaved"
    );
    if (rowsToSave.length > 0) {
      const updatedRecords = rowsToSave.map((record) => ({
        id: record.id,
        ...record,
        isTcp: !!tcpStatus[record.id],
        tcpExclusion: tcpExclusions[record.id] || "",
        updatedBy: userService.userValue.id,
      }));

      try {
        console.log("Saving changed records:", updatedRecords);
        const response = await tcpService.bulkUpdate(updatedRecords);
        if (response.success) {
          sendAlert("success", "Changed records saved successfully.");

          // Update only the changed rows in the records and filteredRecords states
          setRecords((prev) => {
            const updatedRecordsMap = new Map(
              updatedRecords.map((row) => [row.id, row])
            );
            return prev.map((record) =>
              updatedRecordsMap.has(record.id)
                ? { ...record, ...updatedRecordsMap.get(record.id) }
                : record
            );
          });

          setFilteredRecords((prev) => {
            const updatedRecordsMap = new Map(
              updatedRecords.map((row) => [row.id, row])
            );
            return prev.map((record) =>
              updatedRecordsMap.has(record.id)
                ? { ...record, ...updatedRecordsMap.get(record.id) }
                : record
            );
          });

          // Mark saved rows as successfully saved
          setChangedRows((prev) =>
            rowsToSave.reduce(
              (acc, row) => {
                acc[row.id] = "saved";
                return acc;
              },
              { ...prev }
            )
          );
        } else {
          sendAlert("error", "Failed to save changed records.");
        }
      } catch (error) {
        console.error("Error saving changed records:", error);
        sendAlert("error", "An error occurred while saving changed records.");
      }
    }
  };

  const handleSaveAll = async () => {
    await saveChangedRows(); // Save only unsaved rows when the user clicks the save button
  };

  const handleChangePage = async (event, newPage) => {
    await saveChangedRows(); // Save only unsaved rows before navigating
    setPage(newPage);
  };

  const handleTcpToggle = (id) => {
    setTcpStatus((prev) => {
      const updatedStatus = {
        ...prev,
        [id]: !prev[id],
      };

      // Check if the value matches the original value from savedRecords
      const originalValue = savedRecords.find(
        (record) => record.id === id
      )?.isTcp;
      const isReverted = updatedStatus[id] === originalValue;

      setChangedRows((prev) => ({
        ...prev,
        [id]: isReverted ? false : "unsaved", // Remove orange highlight if reverted
      }));

      return updatedStatus;
    });
  };

  const handleTcpExclusionChange = (id, value) => {
    setTcpExclusions((prev) => {
      const updatedExclusions = {
        ...prev,
        [id]: value,
      };

      // Check if the value matches the original value from savedRecords
      const originalValue =
        savedRecords.find((record) => record.id === id)?.tcpExclusion || "";
      const isReverted = updatedExclusions[id] === originalValue;

      setChangedRows((prev) => ({
        ...prev,
        [id]: isReverted ? false : "unsaved", // Remove orange highlight if reverted
      }));

      return updatedExclusions;
    });
  };

  const handleSearch = (event) => {
    const lowerCaseSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(lowerCaseSearchTerm);

    // Filter records based on the search term
    setFilteredRecords(
      records.filter(
        (record) =>
          Object.values(record)
            .join(" ") // Combine all record values into a single string
            .toLowerCase()
            .includes(lowerCaseSearchTerm) // Check if the search term is included
      )
    );
  };

  const displayedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (records.length === 0) {
    return (
      <Typography variant="h6">No records available to display.</Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Review Records
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch} // Use the updated search handler
        sx={{ marginBottom: 2 }}
      />
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {fieldMapping.map((field, index) => (
                <TableCell key={index}>{field.label}</TableCell>
              ))}
              <TableCell>Mark as TCP</TableCell>
              <TableCell>Exclusion Reason</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.map((record) => (
              <TableRow
                key={record.id}
                sx={{
                  backgroundColor: getRowHighlightColor(record, changedRows),
                }}
              >
                {fieldMapping.map((field, fieldIndex) => (
                  <TableCell key={fieldIndex}>
                    {record[field.name] || "-"}
                  </TableCell>
                ))}
                <TableCell>
                  <Checkbox
                    checked={!!tcpStatus[record.id]}
                    onChange={() => handleTcpToggle(record.id)}
                  />
                </TableCell>
                <TableCell sx={{ width: "300px" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    value={tcpExclusions[record.id] || ""}
                    onChange={(e) =>
                      handleTcpExclusionChange(record.id, e.target.value)
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
        onRowsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAll}
          sx={{ marginRight: 2 }}
        >
          Save All Changes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={async () => {
            await saveChangedRows();
            navigate(/reports/ptrs/step2/${reportId});
          }}
        >
          Next: Add Additional Details
        </Button>
      </Box>
    </Box>
  );
}