import { createTheme } from "@mui/material/styles";

const lightPalette = {
  primary: {
    main: "#607d8b", // Medium Blue Grey
  },
  secondary: {
    main: "#263238", // Dark Blue Grey
  },
  background: {
    default: "#eceff1", // Light Blue Grey
    paper: "#ffffff", // Paper background color remains white
  },
  text: {
    primary: "#263238", // Dark Blue Grey for primary text
    secondary: "#607d8b", // Medium Blue Grey for secondary text
  },
  action: {
    hoverOpacity: 0.08, // Ensure hoverOpacity is defined
  },
};

const darkPalette = {
  primary: {
    main: "#90caf9", // Light Blue
  },
  secondary: {
    main: "#ce93d8", // Light Purple
  },
  background: {
    default: "#121212", // Dark background
    paper: "#1e1e1e", // Slightly lighter dark background for paper
  },
  text: {
    primary: "#ffffff", // White for primary text
    secondary: "rgba(255, 255, 255, 0.7)", // Muted white for secondary text
  },
  action: {
    hoverOpacity: 0.08, // Ensure hoverOpacity is defined
  },
};

const globalTheme = (mode) => {
  // Ensure mode is extracted if passed as an object or is undefined
  if (typeof mode === "object" && mode.mode) {
    mode = mode.mode; // Extract the mode property
  }

  if (!mode || typeof mode !== "string") {
    // console.error(
    //   "Invalid mode provided to globalTheme. Defaulting to 'light'.",
    //   mode
    // );
    mode = "light"; // Default to light mode if mode is invalid
  }

  // console.log("globalTheme mode", mode); // Debug log to check the theme mode

  return createTheme({
    palette: {
      mode, // Ensure mode is either "light" or "dark"
      ...(mode === "light" ? lightPalette : darkPalette),
    },
    typography: {
      fontFamily: "'Roboto', 'Arial', sans-serif",
      h4: {
        fontWeight: 600,
        fontSize: "1.8rem",
      },
      body1: {
        fontSize: "1rem",
        color: mode === "light" ? "#555555" : "#cccccc", // Adjust text color for modes
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor:
              mode === "light"
                ? lightPalette.background.paper
                : darkPalette.background.paper,
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
            backgroundColor: mode === "light" ? "#1976d2" : "#42a5f5",
            "&:hover": {
              backgroundColor: mode === "light" ? "#1565c0" : "#1e88e5",
              opacity:
                mode === "light"
                  ? lightPalette.action.hoverOpacity
                  : darkPalette.action.hoverOpacity, // Use hoverOpacity from the palette
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
};

export default globalTheme;
