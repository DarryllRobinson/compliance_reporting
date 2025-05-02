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
import { useLoaderData } from "react-router";
import { ptrsService } from "../../../services/ptrs.service";
import { userService } from "../../../services/user.service";

export async function reviewRecordsLoader({ params }) {
  const { reportId } = params; // Extract reportId from route params
  try {
    const savedRecords = await ptrsService.getAllByReportId(reportId); // Fetch records by reportId
    return { savedRecords: savedRecords || [] }; // Return saved records or an empty array
  } catch (error) {
    console.error("Error fetching records:", error);
    throw new Response("Failed to fetch records", { status: 500 });
  }
}

export default function ReviewRecords() {
  const theme = useTheme();
  const { sendAlert } = useAlert();
  const { savedRecords } = useLoaderData(); // Access saved records from loader
  const [records, setRecords] = useState(savedRecords); // Initialize with saved records
  const [filteredRecords, setFilteredRecords] = useState(savedRecords); // Initialize with saved records
  const [searchTerm, setSearchTerm] = useState("");
  const [tcpStatus, setTcpStatus] = useState(() =>
    savedRecords.reduce((acc, _, index) => {
      acc[index] = true; // Default all checkboxes to checked
      return acc;
    }, {})
  );
  const [comments, setComments] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const saveRecords = async (updatedRecords) => {
    try {
      console.log("Updated records:", updatedRecords); // Debug log to check the structure of updated records
      const response = await ptrsService.bulkUpdate(updatedRecords); // Save records to the backend
      console.log("Save response:", response); // Debug log to check the response
      if (response.success) {
        sendAlert("success", "Records updated successfully.");
      } else {
        sendAlert("error", "Failed to update records.");
      }
    } catch (error) {
      console.error("Error saving records:", error);
      sendAlert("error", "An error occurred while saving records.");
    }
  };

  const handleSave = async () => {
    const updatedRecords = records
      .filter((record, index) => {
        return !!tcpStatus[index] || comments[index]; // Check if TCP status or comment has been updated
      })
      .map((record, index) => ({
        id: record.id, // Include the correct database ID
        ...record,
        isTcp: !!tcpStatus[index],
        comment: comments[index] || "",
        updatedBy: userService.userValue.id, // Add the user ID of the person updating
      }));

    if (updatedRecords.length > 0) {
      await saveRecords(updatedRecords); // Call the saveRecords function
    } else {
      sendAlert("info", "No records have been updated.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    const lowerCaseSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(lowerCaseSearchTerm);
    setFilteredRecords(
      records.filter((record) =>
        Object.values(record)
          .join(" ")
          .toLowerCase()
          .includes(lowerCaseSearchTerm)
      )
    );
  };

  const handleTcpToggle = (index) => {
    setTcpStatus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCommentChange = (index, value) => {
    setComments((prev) => ({
      ...prev,
      [index]: value,
    }));
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
        onChange={handleSearch}
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
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.map((record, index) => (
              <TableRow key={record.id}>
                {fieldMapping.map((field, fieldIndex) => (
                  <TableCell key={fieldIndex}>
                    {record[field.name] || "-"}
                  </TableCell>
                ))}
                <TableCell>
                  <Checkbox
                    checked={!!tcpStatus[index]}
                    onChange={() => handleTcpToggle(index)}
                  />
                </TableCell>
                <TableCell sx={{ width: "300px" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    value={comments[index] || ""}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ marginTop: 2 }}
      >
        Save TCP Records
      </Button>
    </Box>
  );
}
