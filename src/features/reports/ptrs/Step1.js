import { useState, useEffect, useRef } from "react";
import {
  Typography,
  useTheme,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { tcpService, tcpRulesService, userService } from "../../../services";
import CollapsibleTable from "./CollapsibleTable";

export default function Step1({
  savedRecords = [],
  onNext,
  reportId,
  reportStatus,
  onSave,
}) {
  // Prevent navigating back into this page via browser back unless allowed
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Show confirmation dialog on refresh or back
    };

    const handlePopState = (e) => {
      // Force forward navigation or refresh
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const currentStep = 1;
  const theme = useTheme();
  const [alert, setAlert] = useState(null);
  const isLocked = reportStatus === "Submitted";
  const [records, setRecords] = useState(() =>
    savedRecords.map((r) => ({ ...r, isTcp: !!r.isTcp }))
  );
  const [filteredRecords, setFilteredRecords] = useState(() =>
    savedRecords.map((r) => ({ ...r, isTcp: !!r.isTcp }))
  );
  const [tcpStatus, setTcpStatus] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.isTcp !== false;
      return acc;
    }, {})
  );

  useEffect(() => {
    console.log("Saved Records on mount:", savedRecords);
    const initialized = savedRecords.map((r) => ({
      ...r,
      isTcp: !!r.isTcp,
    }));
    if (JSON.stringify(records) !== JSON.stringify(initialized)) {
      setRecords(initialized);
      setFilteredRecords(initialized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedRecords]);

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

  // State for tcpExclusionComment field per record
  const [tcpExclusionComments, setTcpExclusionComments] = useState(() =>
    savedRecords.reduce((acc, record) => {
      acc[record.id] = record.tcpExclusionComment || "";
      return acc;
    }, {})
  );

  // TCP Rule Builder State
  const [tcpRules, setTcpRules] = useState([]);
  const [newRule, setNewRule] = useState({ field: "description", keyword: "" });

  // Apply TCP Rules to records, optionally with rules parameter
  const applyTcpRules = (baseRecords, rules = tcpRules) => {
    return baseRecords.map((record) => {
      const matches = rules.some((rule) => {
        const value = (record[rule.field] || "").toLowerCase();
        return value.includes(rule.keyword.toLowerCase());
      });
      return {
        ...record,
        systemRecommendation: !matches,
      };
    });
  };

  // Add new rule and update records, persist to backend
  const handleAddRule = async () => {
    if (newRule.keyword.trim()) {
      const ruleToCreate = {
        ...newRule,
        clientId: userService.userValue.clientId,
      };
      const savedRule = await tcpRulesService.create(ruleToCreate);
      const updatedRules = [...tcpRules, savedRule];
      setTcpRules(updatedRules);
      setRecords(applyTcpRules(records, updatedRules));
    }
  };

  // Remove rule and update records, persist deletion to backend
  const handleDeleteRule = async (index) => {
    const ruleToDelete = tcpRules[index];
    await tcpRulesService.delete(ruleToDelete.id);
    const updated = tcpRules.filter((_, i) => i !== index);
    setTcpRules(updated);
    setRecords(applyTcpRules(records, updated));
  };

  // On component mount, fetch TCP rules from backend and apply to records
  useEffect(() => {
    const clientId = userService.userValue.clientId;
    tcpRulesService.getByClient(clientId).then((rules) => {
      const safeRules = Array.isArray(rules) ? rules : [];
      setTcpRules(safeRules);
      setRecords(applyTcpRules(records, safeRules));
    });
    // eslint-disable-next-line
  }, []);
  const [upliftOpen, setUpliftOpen] = useState(false);
  const hasIncomplete = records.some((r) => r.requiresAttention);

  const saveChangedRows = async () => {
    // Utility to get only updated fields
    function getUpdatedFields(original, current) {
      const updates = {};
      for (const key in current) {
        const currentVal = current[key];
        const originalVal = original[key];

        const isDifferent = (currentVal ?? null) !== (originalVal ?? null); // nullish-aware comparison

        if (isDifferent) {
          updates[key] = currentVal;
        }
      }
      return updates;
    }

    // Filter records that are marked as "unsaved"
    const rowsToSave = records.filter(
      (record) => changedRows[record.id] === "unsaved"
    );
    if (rowsToSave.length > 0) {
      const updatedRecords = rowsToSave.map((record) => {
        const { createdAt, updatedAt, ...cleanRecord } = record;
        const original = savedRecords.find((r) => r.id === record.id) || {};

        const patch = getUpdatedFields(original, {
          ...cleanRecord,
          isTcp: !!tcpStatus[record.id],
          tcpExclusionComment: tcpExclusionComments[record.id]?.trim() || null,
          // paymentDate: formatDateForMySQL(record.paymentDate),
        });

        return {
          id: record.id,
          ...patch,
          updatedBy: userService.userValue.id,
        };
      });

      try {
        const response = await Promise.all(
          updatedRecords.map((record) =>
            tcpService.patchRecord(record.id, record)
          )
        );
        if (response[0].success) {
          setAlert({
            type: "success",
            message: "Changed records saved successfully.",
          });

          // Update only the changed rows in the `records` and `filteredRecords` states
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

          setTcpExclusionComments((prev) => {
            const updated = { ...prev };
            updatedRecords.forEach((rec) => {
              updated[rec.id] = rec.tcpExclusionComment || "";
            });
            return updated;
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
          setAlert({
            type: "error",
            message: "An error occurred while saving changed records.",
          });
        }
      } catch (error) {
        console.error("Error saving changed records:", error);
        setAlert({
          type: "error",
          message: "An error occurred while saving changed records.",
        });
      }
    }
  };

  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  if (records.length === 0) {
    return (
      <Typography variant="h6">No records available to display.</Typography>
    );
  }

  console.log("Changed Rows:", changedRows);
  console.log("First 5 records sample:", records.slice(0, 5));

  // Removed problematic useEffect that registered onSave(saveChangedRows)
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <>
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

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

      {/* TCP Rule Builder Panel */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Exclusion Rules (TCP)
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Field"
            value={newRule.field}
            onChange={(e) =>
              setNewRule((prev) => ({ ...prev, field: e.target.value }))
            }
          >
            <MenuItem value="description">Description</MenuItem>
            <MenuItem value="payeeName">Payee Name</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Keyword"
            value={newRule.keyword}
            onChange={(e) =>
              setNewRule((prev) => ({ ...prev, keyword: e.target.value }))
            }
          />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleAddRule} variant="contained" fullWidth>
            Add Rule
          </Button>
        </Grid>
      </Grid>
      {tcpRules.map((rule, index) => (
        <Typography key={index} sx={{ mb: 1 }}>
          {rule.field}: contains "{rule.keyword}"{" "}
          <IconButton size="small" onClick={() => handleDeleteRule(index)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Typography>
      ))}

      <Alert severity="info" sx={{ mb: 2 }}>
        <div>
          🟡 <strong>{records.length}</strong> record(s) loaded for review.
        </div>
        <div>
          {records.filter((r) => String(r.payeeEntityAbn ?? "").trim() === "")
            .length > 0
            ? "⚠️"
            : "✅"}{" "}
          <strong>
            {
              records.filter(
                (r) => String(r.payeeEntityAbn ?? "").trim() === ""
              ).length
            }
          </strong>{" "}
          record(s) missing Payee ABN
        </div>
        <div>
          {records.filter(
            (r) =>
              !(
                typeof r.payeeEntityName === "string" &&
                r.payeeEntityName.trim()
              )
          ).length > 0
            ? "⚠️"
            : "✅"}{" "}
          <strong>
            {
              records.filter(
                (r) =>
                  !(
                    typeof r.payeeEntityName === "string" &&
                    r.payeeEntityName.trim()
                  )
              ).length
            }
          </strong>{" "}
          record(s) missing Payee Name
        </div>
        <div>
          🧠{" "}
          <strong>
            {records.filter((r) => r.systemRecommendation === false).length}
          </strong>{" "}
          record(s) are recommended by the system to be excluded from TCP.
        </div>
      </Alert>

      <CollapsibleTable
        records={records}
        savedRecords={savedRecords}
        changedRows={changedRows}
        setChangedRows={setChangedRows}
        tcpStatus={tcpStatus}
        setTcpStatus={setTcpStatus}
        tcpExclusionComments={tcpExclusionComments}
        setTcpExclusionComments={setTcpExclusionComments}
        isLocked={isLocked}
        currentStep={currentStep}
        theme={theme}
        requiresAttention={records.reduce((acc, r) => {
          acc[r.id] =
            String(r.payeeEntityAbn ?? "").trim() === "" ||
            String(r.payeeEntityName ?? "").trim() === "";
          return acc;
        }, {})}
        systemRecommendation={records.reduce((acc, r) => {
          acc[r.id] = r.systemRecommendation !== false; // default to true
          return acc;
        }, {})}
        stickyHeader={true}
        filterText={filterText}
        setFilterText={setFilterText}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        // If CollapsibleTable has a next button, ensure it uses handleNext
        onNext={handleNext}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={saveChangedRows}
        disabled={isLocked}
        sx={{ mt: 2 }}
      >
        Save Records
      </Button>
    </>
  );
}
