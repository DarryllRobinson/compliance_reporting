import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import { Box, Typography, CircularProgress } from "@mui/material";

const StaticPageViewer = () => {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const res = await fetch(`/static-content/blog/${slug}.md`);
        if (!res.ok) throw new Error("File not found");
        const text = await res.text();
        setContent(text);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkdown();
  }, [slug]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Content not found.</Typography>;

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Box>
  );
};

export default StaticPageViewer;
