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

export default function ReviewRecords({ records, onSave }) {
  const theme = useTheme();
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [searchTerm, setSearchTerm] = useState("");
  const [tcpStatus, setTcpStatus] = useState({}); // Track TCP status for each record
  const [comments, setComments] = useState({}); // Track comments for each record
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleSave = () => {
    const tcpRecords = records.map((record, index) => ({
      ...record,
      isTcp: !!tcpStatus[index],
      comment: comments[index] || "",
    }));
    onSave(tcpRecords); // Pass the updated records to the parent component
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
              <TableRow key={index}>
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
