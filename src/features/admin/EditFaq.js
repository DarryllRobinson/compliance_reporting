import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { fetchWrapper } from "../../lib/utils/fetch-wrapper";

const EditFaq = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWrapper.get("/api/admin/content/faq")
      .then((data) => {
        setContent(data.content);
        setLoading(false);
      })
      .catch(() => {
        setContent("⚠️ Failed to load FAQ content.");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchWrapper.post("/api/admin/save-faq", { content });
      alert("✅ FAQ saved successfully!");
    } catch {
      alert("❌ Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Edit FAQ</Typography>
      <MDEditor value={content} onChange={setContent} height={500} />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditFaq;
