import { useState, useMemo, useCallback } from "react";
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
  useTheme,
  Tooltip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { formatCurrency, formatDateForMySQL } from "../../../lib/utils/";
import { getRowHighlightColor } from "../../../lib/utils/highlightRow";
import { fieldMapping } from "./fieldMapping";
import { useReportContext } from "../../../context";

const DEFAULT_SORT_CONFIG = {
  key: null,
  direction: "asc",
  filters: {},
};

export default function CollapsibleTable({ editableFields, hiddenColumns }) {
  const { records, handleRecordChange, handleSaveUpdates } = useReportContext();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [sortConfig, setSortConfig] = useState(DEFAULT_SORT_CONFIG);
  const [upliftOpen, setUpliftOpen] = useState(false);
  // A record is "incomplete" if it has an issue or a recommended exclusion
  const hasIncomplete = records.some((r) => {
    return Boolean(r.hasIssue) || Boolean(r.hasExclusion);
  });

  const toggleGroup = useCallback(
    (group) =>
      setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] })),
    []
  );

  const groupedVisibleFields = useMemo(() => {
    const filtered = fieldMapping.filter(
      (field) => !hiddenColumns?.includes(field.name)
    );

    const groups = {};
    for (const field of filtered) {
      const group = field.group || "other";
      if (!groups[group]) groups[group] = [];
      groups[group].push(field);
    }

    return groups;
  }, [hiddenColumns]);

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
        if (key === "flagStatus") {
          if (value === "issue") return record.hasIssue;
          if (value === "exclusion") return record.hasExclusion;
          if (value === "none") return !record.hasIssue && !record.hasExclusion;
          return true;
        }
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

  return (
    <>
      {hasIncomplete && (
        <Button
          variant="contained"
          color="primary"
          sx={{
            mb: 2,
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.secondary.main,
            fontWeight: "bold",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
              boxShadow: 4,
            },
          }}
          onClick={() => setUpliftOpen(true)}
        >
          Fix Incomplete Records
        </Button>
      )}

      <Dialog
        open={upliftOpen}
        onClose={() => setUpliftOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          Data Uplift Coming Soon
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography gutterBottom>
            This feature will allow you to automatically enhance incomplete
            records (e.g. missing ABN or supplier names) using verified external
            data sources.
          </Typography>
          <Typography>
            A small fee per record will apply for uplift. Stay tuned!
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Button
            onClick={() => setUpliftOpen(false)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
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
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "70vh", // Use a viewport-relative height for more rows
          p: 0,
          backgroundColor: theme.palette.background.paper,
          // overflow: 'auto', // Not needed, MUI sets this for maxHeight
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 11,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <TableCell
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontWeight: "bold",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              />
              {Object.entries(groupedVisibleFields).map(([group, fields]) => (
                <TableCell
                  key={group}
                  align="center"
                  colSpan={collapsedGroups[group] ? 1 : fields.length}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
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
                    <IconButton
                      size="small"
                      sx={{ ml: 1, color: theme.palette.text.primary }}
                    >
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
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  verticalAlign: "bottom",
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              >
                ⚠️ 🧠
                <Select
                  size="small"
                  variant="standard"
                  fullWidth
                  value={sortConfig?.filters?.["flagStatus"] ?? ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const { value } = e.target;
                    setSortConfig((prev) => {
                      const newFilters = {
                        ...(prev.filters || {}),
                        flagStatus: value,
                      };
                      return { ...prev, filters: newFilters };
                    });
                  }}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                      },
                    },
                  }}
                >
                  <MenuItem value="">(All)</MenuItem>
                  <MenuItem value="issue">⚠️ Issue</MenuItem>
                  <MenuItem value="exclusion">
                    🧠 Recommended Exclusion
                  </MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </TableCell>
              {Object.entries(groupedVisibleFields).flatMap(
                ([group, fields]) =>
                  collapsedGroups[group]
                    ? [
                        <TableCell
                          key={`${group}-collapsed`}
                          sx={{
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                          }}
                        />,
                      ]
                    : fields.map((field) => {
                        if (hiddenColumns?.includes(field.name)) return null;
                        return (
                          <TableCell
                            key={field.name}
                            onClick={() => {
                              setSortConfig((prev) => ({
                                ...prev,
                                key: field.name,
                                direction:
                                  prev &&
                                  prev.key === field.name &&
                                  prev.direction === "asc"
                                    ? "desc"
                                    : "asc",
                              }));
                            }}
                            sx={{
                              userSelect: "none",
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                              verticalAlign: "bottom",
                              backgroundColor: theme.palette.background.paper,
                              color: theme.palette.text.primary,
                            }}
                          >
                            <Tooltip title="Click to sort" placement="top-end">
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
                                    {sortConfig.direction === "asc"
                                      ? "🔼"
                                      : "🔽"}
                                  </Typography>
                                )}
                              </Box>
                            </Tooltip>
                            <Select
                              size="small"
                              variant="standard"
                              fullWidth
                              displayEmpty
                              value={sortConfig?.filters?.[field.name] ?? ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const { value } = e.target;
                                setSortConfig((prev) => {
                                  const newFilters = {
                                    ...(prev.filters || {}),
                                    [field.name]: value,
                                  };
                                  return { ...prev, filters: newFilters };
                                });
                              }}
                              sx={{
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    backgroundColor:
                                      theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                  },
                                },
                              }}
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
                        );
                      })
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.map((record) => {
              // Calculate payment term and time for this record
              return (
                <TableRow
                  key={record.id}
                  sx={{
                    backgroundColor: getRowHighlightColor({
                      id: record.id,
                      isError: false,
                      wasChanged: record.wasChanged || false,
                      wasSaved:
                        new Date(record.updatedAt) > new Date(record.createdAt),
                      partialPayment: record.partialPayment,
                    }),
                  }}
                >
                  <TableCell>
                    {record.hasExclusion ? (
                      <Tooltip title="Recommended Exclusion">
                        <Typography fontWeight="bold">🧠</Typography>
                      </Tooltip>
                    ) : record.hasIssue ? (
                      <Tooltip title="Issue">
                        <Typography color="error" fontWeight="bold">
                          ⚠️
                        </Typography>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                  {Object.entries(groupedVisibleFields).flatMap(
                    ([group, fields]) =>
                      collapsedGroups[group]
                        ? [
                            <TableCell
                              key={`${record.id}-${group}-collapsed`}
                            />,
                          ]
                        : fields.map((field) => {
                            if (hiddenColumns?.includes(field.name))
                              return null;
                            const isEditable = editableFields?.includes(
                              field.name
                            );

                            return (
                              <TableCell key={`${record.id}-${field.name}`}>
                                {field.type === "amount" ? (
                                  formatCurrency(record[field.name])
                                ) : field.type === "date" ? (
                                  formatDateForMySQL(record[field.name])
                                ) : field.type === "checkbox" ? (
                                  isEditable ? (
                                    <Checkbox
                                      checked={Boolean(record[field.name])}
                                      onChange={(e) =>
                                        handleRecordChange(
                                          record.id,
                                          field.name,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  ) : (
                                    <Checkbox
                                      checked={Boolean(record[field.name])}
                                      disabled
                                    />
                                  )
                                ) : isEditable ? (
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    multiline={field.multiline || false}
                                    value={record[field.name] || ""}
                                    onChange={(e) =>
                                      handleRecordChange(
                                        record.id,
                                        field.name,
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  record[field.name] || "-"
                                )}
                              </TableCell>
                            );
                          })
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRecords.length}
        page={page}
        onPageChange={(_, newPage) => {
          const changedRecords = displayedRecords.filter(
            (rec) => rec.wasChanged
          );
          if (changedRecords.length > 0) {
            // Save updates before changing page
            handleSaveUpdates();
          }
          setPage(newPage);
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 25))
        }
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </>
  );
}
