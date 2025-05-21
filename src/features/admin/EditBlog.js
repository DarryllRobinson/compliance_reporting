import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Box, Button, TextField, Typography } from "@mui/material";
import { adminService } from "../../services/admin/admin";

import MDEditor from "@uiw/react-md-editor";

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const { slug: routeSlug } = useParams();

  useEffect(() => {
    if (!routeSlug) return;
    adminService
      .getBySlug(routeSlug)
      .then((data) => {
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
      })
      .catch(() => {
        alert("⚠️ Failed to load blog.");
      });
  }, [routeSlug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.saveBlog({ title, slug, content });
      alert("✅ Blog saved successfully!");
    } catch (err) {
      alert("❌ Failed to save blog.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create or Edit Blog Post
      </Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Slug (e.g. my-post-title)"
        fullWidth
        margin="normal"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <MDEditor value={content} onChange={setContent} height={500} />
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Blog Post"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditBlog;
