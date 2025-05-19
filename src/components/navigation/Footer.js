import { Link as RouterLink } from "react-router";
import { Box, Link, Typography, useTheme } from "@mui/material";

function Footer(props) {
  const theme = useTheme();

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
      <Box sx={{ mt: 2 }}>
        <Link
          href="#top"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "0.875rem" }}
        >
          Back to top ↑
        </Link>
      </Box>
    </Box>
  );
}

export default Footer;
