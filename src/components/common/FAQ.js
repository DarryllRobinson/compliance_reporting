import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  CircularProgress,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { adminService } from "../../services/admin/admin";

function renderMarkdown(content) {
  const lines = content.split("\n");
  const faqs = [];
  let currentTitle = null;
  let currentBody = [];

  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      if (currentTitle && currentBody.length) {
        faqs.push({ title: currentTitle, body: currentBody.join("\n") });
      }
      currentTitle = line.replace(/^##\s*/, "");
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  });

  if (currentTitle && currentBody.length) {
    faqs.push({ title: currentTitle, body: currentBody.join("\n") });
  }

  return faqs.map(({ title, body }, i) => (
    <Accordion key={i} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ReactMarkdown>{body}</ReactMarkdown>
      </AccordionDetails>
    </Accordion>
  ));
}

export default function FAQ() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminService
      .getBySlug("faq")
      .then((data) => {
        setContent(data.content || "No FAQ content available.");
        setError(false);
      })
      .catch(() => {
        setError(true);
        setContent("⚠️ Failed to load FAQ content.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Monochrome Compliance</title>
      </Helmet>
      <Box sx={{ maxWidth: 800, mx: "auto", my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Frequently Asked Questions
        </Typography>
        {loading ? <CircularProgress /> : <Box>{renderMarkdown(content)}</Box>}
      </Box>
    </>
  );
}
