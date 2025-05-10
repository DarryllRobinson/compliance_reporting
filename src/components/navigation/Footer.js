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
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
        <Link
          component={RouterLink}
          to="/legal"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "0.875rem" }}
        >
          Legal
        </Link>
        <Link
          component={RouterLink}
          to="/privacy"
          color="inherit"
          underline="hover"
          sx={{ fontSize: "0.875rem" }}
        >
          Privacy
        </Link>
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
    </Box>
  );
}

export default Footer;
