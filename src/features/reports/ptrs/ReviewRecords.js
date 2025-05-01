import React, { useState, useEffect } from "react";
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

export default function ReviewRecords({ fetchRecords, onSave }) {
  const theme = useTheme();
  const { sendAlert } = useAlert();
  const [records, setRecords] = useState([]); // Records fetched from the backend
  const [filteredRecords, setFilteredRecords] = useState([]); // Ensure this is initialized as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [tcpStatus, setTcpStatus] = useState({}); // Track TCP status for each record
  const [comments, setComments] = useState({}); // Track comments for each record
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch records from the backend
    fetchRecords()
      .then((fetchedRecords) => {
        if (Array.isArray(fetchedRecords) && fetchedRecords.length > 0) {
          setRecords(fetchedRecords); // Set records if data is valid
          setFilteredRecords(fetchedRecords); // Set filteredRecords if data is valid
        } else {
          console.warn("No records fetched or invalid data structure.");
          setRecords([]); // Fallback to empty array
          setFilteredRecords([]); // Fallback to empty array
        }
        setIsLoading(false); // Set loading to false after fetching
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
        sendAlert("error", "Failed to fetch records.");
        setIsLoading(false); // Set loading to false even if there's an error
      });
  }, [fetchRecords, sendAlert]);

  useEffect(() => {
    // Filter records based on the search term
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    setFilteredRecords(
      records.filter((record) =>
        Object.values(record)
          .join(" ")
          .toLowerCase()
          .includes(lowerCaseSearchTerm)
      )
    );
  }, [searchTerm, records]);

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
      }));

    if (updatedRecords.length > 0) {
      console.log("Updated Records with IDs:", updatedRecords);
      setIsLoading(true); // Set loading to true while saving
      try {
        await onSave(updatedRecords); // Save the updated records
        sendAlert("success", "Records updated successfully.");
        // Refetch records after saving
        const fetchedRecords = await fetchRecords();
        setRecords(fetchedRecords || []);
        setFilteredRecords(fetchedRecords || []);
      } catch (error) {
        console.error("Error saving records:", error);
        sendAlert("error", "Failed to save records.");
      } finally {
        setIsLoading(false); // Set loading to false after saving
      }
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

  const displayedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return <Typography variant="h6">Loading records...</Typography>;
  }

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
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                zIndex: 1,
              }}
            >
              {Object.keys(records[0] || {}).map((field, index) => (
                <TableCell key={index}>{field}</TableCell>
              ))}
              <TableCell>Mark as TCP</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.map((record, index) => (
              <TableRow key={record.id}>
                {Object.values(record).map((value, fieldIndex) => (
                  <TableCell key={fieldIndex}>{value || "-"}</TableCell>
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
