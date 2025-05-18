import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const parseFrontMatter = (text) => {
  const frontmatter = {};
  const normalized = text.replace(/\r\n/g, "\n"); // normalize CRLF to LF
  const match = normalized.match(/^---\n([\s\S]+?)\n---/);
  if (match) {
    const lines = match[1].split("\n");
    for (const line of lines) {
      if (!line.includes(":")) continue;
      const [key, ...rest] = line.split(":");
      frontmatter[key.trim()] = rest.join(":").trim();
    }
  }
  return {
    content: normalized.replace(/^---[\s\S]+?---/, "").trim(),
    data: frontmatter,
  };
};

const StaticPageViewer = () => {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const res = await fetch(`/static-content/blog/${slug}.md`);
        if (!res.ok) throw new Error("File not found");
        const raw = await res.text();

        const parsed = parseFrontMatter(raw);
        setContent(parsed.content || "");
        setMeta(parsed.data || {});
        setError(false);
      } catch (err) {
        setError(true);
        setContent("");
        setMeta({});
      } finally {
        setLoading(false);
      }
    };
    fetchMarkdown();
  }, [slug]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Content not found.</Typography>;

  // Remove YAML frontmatter and HTML comments if gray-matter failed to parse (i.e., meta is empty)
  const displayContent =
    Object.keys(meta).length === 0
      ? content
          .replace(/^---[\s\S]*?---/, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .trim()
      : content;

  return (
    <Box
      sx={{
        maxWidth: "800px",
        mx: "auto",
        p: theme.spacing(4),
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {meta.title && (
        <Typography variant="h4" component="h1" gutterBottom>
          {meta.title}
        </Typography>
      )}
      {(meta.date || meta.author) && (
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {meta.date &&
            `Published: ${new Date(meta.date).toLocaleDateString()}`}
          {meta.date && meta.author && " • "}
          {meta.author && `Author: ${meta.author}`}
        </Typography>
      )}
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <Typography
              variant="h4"
              component="h1"
              sx={{ mt: 4, mb: 2, color: theme.palette.text.primary }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <Typography
              variant="h5"
              component="h2"
              sx={{ mt: 3, mb: 2, color: theme.palette.text.primary }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <Typography
              variant="h6"
              component="h3"
              sx={{ mt: 3, mb: 1.5, color: theme.palette.text.primary }}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <Typography
              variant="body1"
              paragraph
              sx={{ color: theme.palette.text.primary }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li>
              <Typography
                component="span"
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
                {...props}
              />
            </li>
          ),
          a: ({ node, ...props }) => (
            <Typography
              component="a"
              href={props.href}
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "underline",
                "&:hover": { textDecoration: "none" },
              }}
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <Box
              component="blockquote"
              sx={{
                borderLeft: `4px solid ${theme.palette.grey[400]}`,
                pl: 2,
                ml: 0,
                my: 2,
                color: theme.palette.text.secondary,
                fontStyle: "italic",
              }}
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => (
            <Box
              component="code"
              sx={{
                backgroundColor: inline
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
                color: inline
                  ? theme.palette.text.primary
                  : theme.palette.common.white,
                px: inline ? 0.5 : 2,
                py: inline ? 0 : 1,
                borderRadius: 1,
                fontSize: "0.875rem",
                fontFamily: "monospace",
                display: inline ? "inline" : "block",
                overflowX: "auto",
                my: inline ? 0 : 2,
              }}
              {...props}
            >
              {children}
            </Box>
          ),
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </Box>
  );
};

export default StaticPageViewer;
