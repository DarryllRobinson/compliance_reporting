import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, Button, TextField, Typography } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { fetchWrapper } from "../../lib/utils/fetch-wrapper";

const EditBlog = () => {
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchWrapper.get(`/api/admin/content/${slug}`)
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(() => alert("⚠️ Failed to load blog."));
  }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchWrapper.post("/api/admin/save-blog", { title, slug, content });
      alert("✅ Blog saved successfully!");
    } catch {
      alert("❌ Failed to save blog.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Blog Post</Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <MDEditor value={content} onChange={setContent} height={500} />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Blog Post"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditBlog;
