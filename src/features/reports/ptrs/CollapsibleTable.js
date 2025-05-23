import { useState, useMemo, useCallback, useEffect } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  formatCurrency,
  formatDateForMySQL,
  getRowHighlightColor,
} from "../../../lib/utils/";
import { fieldMapping } from "./fieldMapping";
const LOCAL_STORAGE_KEY = "tcpTableSortConfig";

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
  sortConfig,
  setSortConfig,
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

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const passesSearch = Object.values(record)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);

      const passesColumnFilters = Object.entries(
        sortConfig?.filters || {}
      ).every(([key, value]) => {
        const recordValue = String(record[key] || "").toLowerCase();
        if (value === "__empty__") return !record[key];
        return recordValue.includes(value.toLowerCase());
      });

      return passesSearch && passesColumnFilters;
    });
  }, [records, searchTerm, sortConfig?.filters]);

  const sortedRecords = useMemo(() => {
    if (!sortConfig?.key) return filteredRecords;
    return [...filteredRecords].sort((a, b) => {
      const aVal = a[sortConfig.key] || "";
      const bVal = b[sortConfig.key] || "";
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredRecords, sortConfig]);

  const displayedRecords = useMemo(
    () =>
      sortedRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedRecords, page, rowsPerPage]
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

  // Load sortConfig from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSortConfig(parsed);
      } catch {
        console.warn("Invalid sort config in localStorage");
      }
    }
  }, []);

  // Persist sortConfig to localStorage when it changes
  useEffect(() => {
    if (sortConfig) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortConfig));
    }
  }, [sortConfig]);

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
            <TableRow
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 11,
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
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
                        <TableCell
                          key={field.name}
                          onClick={() =>
                            setSortConfig((prev) => ({
                              key: field.name,
                              direction:
                                prev.key === field.name &&
                                prev.direction === "asc"
                                  ? "desc"
                                  : "asc",
                            }))
                          }
                          sx={{
                            cursor: "pointer",
                            userSelect: "none",
                            textDecoration: "underline",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                            verticalAlign: "bottom",
                          }}
                          title="Click to sort"
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {field.label}
                            {sortConfig?.key === field.name && (
                              <Typography variant="body2">
                                {sortConfig.direction === "asc" ? "🔼" : "🔽"}
                              </Typography>
                            )}
                          </Box>
                          <Select
                            size="small"
                            variant="standard"
                            fullWidth
                            disabled={isLocked}
                            displayEmpty
                            value={sortConfig?.filters?.[field.name] ?? ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              setSortConfig((prev) => ({
                                ...prev,
                                filters: {
                                  ...prev?.filters,
                                  [field.name]: e.target.value,
                                },
                              }))
                            }
                          >
                            <MenuItem value="">(All)</MenuItem>
                            <MenuItem value="__empty__">(Empty)</MenuItem>
                            {[
                              ...new Set(
                                records.map((r) => r[field.name] || "")
                              ),
                            ]
                              .filter((v) => v)
                              .map((option) => (
                                <MenuItem key={option} value={option}>
                                  {String(option)}
                                </MenuItem>
                              ))}
                          </Select>
                        </TableCell>
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
      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
        <Button size="small" href="#">
          ↑ Back to top
        </Button>
      </Box>
    </>
  );
}
