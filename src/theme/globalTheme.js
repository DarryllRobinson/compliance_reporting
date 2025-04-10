import { createTheme } from "@mui/material/styles";

const globalTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Primary color
    },
    secondary: {
      main: "#dc004e", // Secondary color
    },
    background: {
      default: "#f5f5f5", // Default background color
      paper: "#ffffff", // Paper background color
    },
    text: {
      primary: "#000000", // Primary text color
      secondary: "#555555", // Secondary text color
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
      fontSize: "1.8rem",
    },
    body1: {
      fontSize: "1rem",
      color: "#555555",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase text
          borderRadius: "8px",
          padding: "10px 16px",
        },
        containedPrimary: {
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px", // Consistent spacing between fields
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: "16px", // Consistent spacing for form controls
        },
      },
    },
  },
});

export default globalTheme;
