import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, Typography, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { adminService } from "../services/admin/admin";

const StaticPageViewer = () => {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const result = await adminService.getBySlug(slug);
        setContent(result.content || "");
      } catch (err) {
        console.error("Error fetching content:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slug]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Content not found.</Typography>;

  return (
    <Box sx={{ maxWidth: "900px", mx: "auto", p: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: "bold",
          mb: 3,
          borderBottom: "2px solid",
          borderColor: "primary.main",
          pb: 1,
        }}
      >
        {content.split("\n")[0].replace(/^#*/, "").trim()}
      </Typography>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          "& h2": {
            marginTop: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            paddingBottom: "0.5rem",
          },
          "& ul": {
            paddingLeft: 3,
          },
          "& a": {
            color: "text.primary",
            textDecoration: "underline",
          },
        }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default StaticPageViewer;
