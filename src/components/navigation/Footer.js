import { Link as RouterLink } from "react-router";
import { Box, Link, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

const fadeSlideIn = {
  "@keyframes fadeSlideIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
};

function Footer(props) {
  const theme = useTheme();

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        py: 3,
        px: 2,
        textAlign: "center",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
      {...props}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        {"Copyright © "}
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          underline="hover"
          sx={{ fontWeight: "bold" }}
        >
          Monochrome Compliance
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
        Legal & Policies
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.5,
          mt: 0.5,
        }}
      >
        <Link
          component={RouterLink}
          to="/legal"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "0.875rem" }}
        >
          Legal
        </Link>
        <span style={{ color: theme.palette.text.disabled }}>•</span>
        <Link
          component={RouterLink}
          to="/privacy"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "0.875rem" }}
        >
          Privacy
        </Link>
        <span style={{ color: theme.palette.text.disabled }}>•</span>
        <Link
          component={RouterLink}
          to="/terms"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "0.875rem" }}
        >
          Terms
        </Link>
      </Box>
      {showScrollButton && (
        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "4px",
            boxShadow: 3,
            p: 1,
            zIndex: 1000,
            animation: showScrollButton
              ? "fadeSlideIn 0.4s ease-out forwards"
              : "none",
            "@keyframes fadeSlideIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Box
            component="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              color: "inherit",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Back to top ↑
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Footer;
