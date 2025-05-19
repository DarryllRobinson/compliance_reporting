import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link as RouterLink } from "react-router";
import ReactMarkdown from "react-markdown";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import SEO from "./SEO";

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
  const [relatedPosts, setRelatedPosts] = useState([]);
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

        try {
          const resIndex = await fetch("/static-content/blog/index.json");
          const index = await resIndex.json();
          const tagSet = new Set(
            (typeof parsed.data.tags === "string"
              ? parsed.data.tags.split(",")
              : parsed.data.tags || []
            ).map((t) => t.trim().toLowerCase())
          );
          const matches = [];

          for (const { slug: otherSlug } of index) {
            if (otherSlug === slug) continue;
            const fileRes = await fetch(`/static-content/blog/${otherSlug}.md`);
            if (!fileRes.ok) continue;
            const rawPost = await fileRes.text();
            const { data: otherMeta } = parseFrontMatter(rawPost);
            const otherTags = (
              typeof otherMeta.tags === "string"
                ? otherMeta.tags.split(",")
                : otherMeta.tags || []
            ).map((t) => t.trim().toLowerCase());
            if (otherTags.some((tag) => tagSet.has(tag))) {
              matches.push({
                slug: otherSlug,
                title: otherMeta.title || otherSlug,
              });
            }
          }

          setRelatedPosts(matches.slice(0, 3));
        } catch (e) {
          console.warn("Unable to load related posts:", e);
        }
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

  // Auto-calculate reading time if not provided
  const estimatedReadingTime = Math.ceil(
    (content.split(/\s+/).length || 0) / 200
  ); // ~200 wpm
  const readingTime = meta.readingTime || estimatedReadingTime;

  // Fallback image
  const fallbackImage =
    "https://monochrome-compliance.com/assets/images/default-blog.png";

  return (
    <>
      <SEO
        title={meta.title || "Article"}
        description={meta.description || ""}
        url={`https://monochrome-compliance.com/blog/${slug}`}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: meta.title || "Article",
            description: meta.description || "",
            datePublished: meta.date || "",
            author: {
              "@type": "Organization",
              name: meta.author || "Monochrome Compliance",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://monochrome-compliance.com/blog/${slug}`,
            },
            keywords: Array.isArray(meta.tags)
              ? meta.tags.join(", ")
              : undefined,
            timeRequired: `PT${readingTime}M`,
            image: meta.image
              ? `https://monochrome-compliance.com${meta.image}`
              : fallbackImage,
          })}
        </script>
      </Helmet>
      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
          p: theme.spacing(4),
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
        }}
      >
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
            p: ({ node, children, ...props }) => {
              const text = children?.[0]?.toString().trim().toLowerCase();

              const isMeta =
                text?.startsWith("published:") && text.includes("author:");
              const isLegal = text?.startsWith(
                "this article provides general information only"
              );
              const isHelp = text?.startsWith("contact us");

              return (
                <Typography
                  variant={isMeta || isLegal || isHelp ? "body2" : "body1"}
                  paragraph
                  sx={{
                    color: theme.palette.text.primary,
                    fontStyle: isLegal ? "italic" : "normal",
                  }}
                  {...props}
                >
                  {children}
                </Typography>
              );
            },
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
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "inline-block",
                  mt: 1,
                  px: 0.5,
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  textDecoration: "none",
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
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
        {relatedPosts.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Related Articles
            </Typography>
            <ul>
              {relatedPosts.map((post) => (
                <li key={post.slug}>
                  <Typography
                    component={RouterLink}
                    to={`/blog/${post.slug}`}
                    variant="body1"
                    sx={{
                      textDecoration: "none",
                      color: theme.palette.text.primary,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {post.title}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    </>
  );
};

export default StaticPageViewer;
