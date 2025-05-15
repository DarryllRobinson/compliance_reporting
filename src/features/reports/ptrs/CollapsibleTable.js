import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  TablePagination,
  IconButton,
  Alert,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { formatCurrency, formatDateForMySQL } from "../../../utils/formatters";
import { getRowHighlightColor } from "../../../utils/highlightRow";
import { fieldMapping } from "./fieldMapping";

export default function CollapsibleTable({
  records,
  savedRecords,
  changedRows,
  setChangedRows,
  tcpStatus,
  setTcpStatus,
  tcpExclusionComments,
  setTcpExclusionComments,
  isLocked,
  currentStep,
  theme,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = useCallback(
    (group) =>
      setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] })),
    []
  );

  const groupedVisibleFields = useMemo(() => {
    const filtered = fieldMapping.filter(
      (field) =>
        !field.requiredAtStep || field.requiredAtStep.includes(currentStep)
    );

    const groups = {};
    for (const field of filtered) {
      const group = field.group || "other";
      if (!groups[group]) groups[group] = [];
      groups[group].push(field);
    }

    return groups;
  }, [currentStep]);

  const handleSearch = (event) => {
    const lower = event.target.value.toLowerCase();
    setSearchTerm(lower);
  };

  const filteredRecords = useMemo(
    () =>
      records.filter((record) =>
        Object.values(record).join(" ").toLowerCase().includes(searchTerm)
      ),
    [records, searchTerm]
  );

  const displayedRecords = useMemo(
    () =>
      filteredRecords.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredRecords, page, rowsPerPage]
  );

  const handleTcpToggle = (id) => {
    setTcpStatus((prev) => {
      const updatedStatus = { ...prev, [id]: !prev[id] };
      const originalValue = !!savedRecords.find((r) => r.id === id)?.isTcp;
      setChangedRows((prevRows) => ({
        ...prevRows,
        [id]: updatedStatus[id] === originalValue ? false : "unsaved",
      }));
      return updatedStatus;
    });
  };

  return (
    <>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        disabled={isLocked}
      />
      <Box sx={{ textAlign: "center", mb: 2 }}>
        {Object.values(collapsedGroups).filter(Boolean).length ===
          Object.keys(groupedVisibleFields).length && (
          <Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => setCollapsedGroups({})}
              sx={{
                fontWeight: "bold",
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Show All Columns
            </Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              All column groups are hidden. Use "Show All Columns" to reset.
            </Typography>
          </Box>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {Object.entries(groupedVisibleFields).map(([group, fields]) => (
                <TableCell
                  key={group}
                  align="center"
                  colSpan={collapsedGroups[group] ? 1 : fields.length}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    fontWeight: "bold",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleGroup(group)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {group.toUpperCase()}
                    <IconButton size="small" sx={{ ml: 1, color: "inherit" }}>
                      {collapsedGroups[group] ? (
                        <KeyboardArrowRightIcon fontSize="inherit" />
                      ) : (
                        <KeyboardArrowDownIcon fontSize="inherit" />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {Object.entries(groupedVisibleFields).flatMap(
                ([group, fields]) =>
                  collapsedGroups[group]
                    ? [<TableCell key={`${group}-collapsed`} />]
                    : fields.map((field) => (
                        <TableCell key={field.name}>{field.label}</TableCell>
                      ))
              )}
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
                {Object.entries(groupedVisibleFields).flatMap(
                  ([group, fields]) =>
                    collapsedGroups[group]
                      ? [<TableCell key={`${record.id}-${group}-collapsed`} />]
                      : fields.map((field) => (
                          <TableCell key={`${record.id}-${field.name}`}>
                            {field.type === "amount" ? (
                              formatCurrency(record[field.name])
                            ) : field.type === "date" ? (
                              formatDateForMySQL(record[field.name])
                            ) : field.name === "isTcp" ? (
                              <Checkbox
                                checked={!!tcpStatus[record.id]}
                                onChange={() => handleTcpToggle(record.id)}
                                disabled={isLocked}
                              />
                            ) : field.name === "tcpExclusionComment" ? (
                              <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                multiline
                                value={tcpExclusionComments[record.id] || ""}
                                onChange={(e) => {
                                  const updated = {
                                    ...tcpExclusionComments,
                                    [record.id]: e.target.value,
                                  };
                                  const originalValue =
                                    savedRecords.find((r) => r.id === record.id)
                                      ?.tcpExclusionComment || "";
                                  const isReverted =
                                    updated[record.id] === originalValue;
                                  setChangedRows((prev) => ({
                                    ...prev,
                                    [record.id]: isReverted ? false : "unsaved",
                                  }));
                                  setTcpExclusionComments(updated);
                                }}
                                disabled={isLocked}
                              />
                            ) : (
                              record[field.name] || "-"
                            )}
                          </TableCell>
                        ))
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRecords.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25]}
      />
    </>
  );
}
