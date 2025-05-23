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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  formatCurrency,
  formatDateForMySQL,
  getRowHighlightColor,
} from "../../../lib/utils/";
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
  requiresAttention,
  systemRecommendation,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const [upliftOpen, setUpliftOpen] = useState(false);
  const hasIncomplete = records.some(
    (r) => requiresAttention && requiresAttention[r.id]
  );

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
      {hasIncomplete && (
        <Button
          variant="outlined"
          color="warning"
          sx={{ mb: 2 }}
          onClick={() => setUpliftOpen(true)}
        >
          Fix Incomplete Records
        </Button>
      )}

      <Dialog open={upliftOpen} onClose={() => setUpliftOpen(false)}>
        <DialogTitle>Data Uplift Coming Soon</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            This feature will allow you to automatically enhance incomplete
            records (e.g. missing ABN or supplier names) using verified external
            data sources.
          </Typography>
          <Typography>
            A small fee per record will apply for uplift. Stay tuned!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpliftOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                ⚠️
              </TableCell>
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
              <TableCell />
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
                <TableCell>
                  {requiresAttention && requiresAttention[record.id] && (
                    <Typography color="error" fontWeight="bold">
                      ⚠️
                    </Typography>
                  )}
                </TableCell>
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
                              <>
                                <Checkbox
                                  checked={!!tcpStatus[record.id]}
                                  onChange={() => handleTcpToggle(record.id)}
                                  disabled={isLocked}
                                />
                                {systemRecommendation &&
                                  systemRecommendation[record.id] === false && (
                                    <Typography
                                      variant="caption"
                                      color="warning.main"
                                    >
                                      System recommends NOT TCP
                                    </Typography>
                                  )}
                              </>
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
