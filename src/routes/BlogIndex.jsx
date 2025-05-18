import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Link,
  CircularProgress,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const POSTS_PER_PAGE = 5;

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
  return frontmatter;
};

const BlogIndex = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState("all");
  const theme = useTheme();

  useEffect(() => {
    const loadPosts = async () => {
      const indexRes = await fetch("/static-content/blog/index.json");
      const index = await indexRes.json();

      const loaded = await Promise.all(
        index.map(async ({ slug }) => {
          const res = await fetch(`/static-content/blog/${slug}.md`);
          const raw = await res.text();
          const { title, description, date, tags = [] } = parseFrontMatter(raw);
          return { slug, title, description, date, tags };
        })
      );

      setAllPosts(loaded.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
    };
    loadPosts();
  }, []);

  const filteredPosts =
    tag === "all"
      ? allPosts
      : allPosts.filter((post) => post.tags?.includes(tag));

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: theme.spacing(4) }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Compliance Blog</Typography>
        <FormControl size="small">
          <InputLabel id="tag-select-label">Filter by tag</InputLabel>
          <Select
            labelId="tag-select-label"
            value={tag}
            label="Filter by tag"
            onChange={(e) => {
              setTag(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All</MenuItem>
            {[...new Set(allPosts.flatMap((p) => p.tags || []))].map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {displayedPosts.map((post) => (
        <Box key={post.slug} sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            <Link
              href={`/blog/${post.slug}`}
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {post.title}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {post.date && !isNaN(new Date(post.date))
              ? new Date(post.date).toLocaleDateString()
              : "No date available"}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {post.description}
          </Typography>
        </Box>
      ))}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
        />
      )}
    </Box>
  );
};

export default BlogIndex;
