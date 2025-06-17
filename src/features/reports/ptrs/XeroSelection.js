import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
} from "@mui/material";
import { xeroService } from "../../../services/xero/xero";

export default function XeroSelection() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialOrgs = (() => {
    try {
      const parsed = JSON.parse(
        decodeURIComponent(searchParams.get("organisations"))
      );
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Failed to parse organisations:", e);
      return [];
    }
  })();
  const [organisations, setOrganisations] = useState(initialOrgs);
  const [selected, setSelected] = useState(
    initialOrgs.map((org) => org.tenantId)
  );
  const [callbackInfo, setCallbackInfo] = useState(null);
  const navigate = useNavigate();
  const { reportId } = useParams();
  const callbackData = location.state?.callbackData || null;

  useEffect(() => {
    if (callbackData) {
      setCallbackInfo(callbackData);
      console.log("Callback Data:", callbackData);
    }
  }, [callbackData]);

  const toggleSelection = (tenantId) => {
    setSelected((prev) =>
      prev.includes(tenantId)
        ? prev.filter((id) => id !== tenantId)
        : [...prev, tenantId]
    );
  };

  const handleContinue = async () => {
    try {
      await fetch("/api/xero/start-extract/" + reportId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantIds: selected }),
      });
      navigate(`/reports/ptrs/${reportId}/connect/progress`);
    } catch (error) {
      console.error("Error starting extract:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {callbackInfo && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="subtitle1">Xero callback received:</Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(callbackInfo, null, 2)}
          </Typography>
        </Box>
      )}
      <Typography variant="h5" gutterBottom>
        Select Xero Organisations
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        {organisations.map((org) => (
          <Box
            key={org.tenantId}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected.includes(org.tenantId)}
                  onChange={() => toggleSelection(org.tenantId)}
                  disabled={org.fetched}
                />
              }
              label={`${org.tenantName || org.orgName || org.tenantId}${org.fetched ? " (Fetched)" : ""}`}
            />
            {process.env.NODE_ENV !== "production" && (
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={async () => {
                  try {
                    await xeroService.triggerExtraction(reportId, [
                      org.tenantId,
                    ]);
                    console.log("Triggered fetch for tenant:", org.tenantId);
                    setOrganisations((prev) =>
                      prev.map((o) =>
                        o.tenantId === org.tenantId
                          ? { ...o, fetched: true }
                          : o
                      )
                    );
                  } catch (err) {
                    console.error(
                      "Error triggering fetch for",
                      org.tenantId,
                      err
                    );
                  }
                }}
              >
                Fetch
              </Button>
            )}
          </Box>
        ))}
      </Paper>
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          onClick={() => (window.location.href = "/api/xero/auth")}
        >
          Connect Another Organisation
        </Button>
        <Button
          variant="contained"
          disabled={selected.length === 0}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
