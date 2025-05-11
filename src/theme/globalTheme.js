import { createTheme } from "@mui/material/styles";

// Palette
// Lightest: #ffffff
// Light: #eceff1
// Dark: #4d4d4d
// Darkest: #141414

const lightPalette = {
  primary: {
    main: "#ffffff", // Lightest for primary color
  },
  secondary: {
    main: "#eceff1", // Light for secondary color
  },
  background: {
    default: "#ffffff", // Lightest for default background
    paper: "#eceff1", // Light for paper background
    navbar: "#eceff1", // Light for navbar background
  },
  text: {
    primary: "#141414", // Darkest for primary text
    secondary: "#4d4d4d", // Dark for secondary text
  },
  action: {
    hoverOpacity: 0.8, // Ensure hoverOpacity is defined
  },
};

const darkPalette = {
  primary: {
    main: "#141414", // Darkest for primary color
  },
  secondary: {
    main: "#4d4d4d", // Dark for secondary color
  },
  background: {
    default: "#141414", // Darkest for default background
    paper: "#4d4d4d", // Dark for paper background
    navbar: "#141414", // Dark for navbar background
  },
  text: {
    primary: "#ffffff", // Lightest for primary text
    secondary: "#eceff1", // Light for secondary text
  },
  action: {
    hoverOpacity: 0.8, // Ensure hoverOpacity is defined
  },
};

const globalTheme = (mode) => {
  // Ensure mode is extracted if passed as an object or is undefined
  if (typeof mode === "object" && mode.mode) {
    mode = mode.mode; // Extract the mode property
  }

  if (!mode || typeof mode !== "string") mode = "light"; // Default to light mode if mode is invalid

  // console.log("globalTheme mode", mode); // Debug log to check the theme mode

  return createTheme({
    palette: {
      mode, // Ensure mode is either "light" or "dark"
      ...(mode === "light" ? lightPalette : darkPalette),
    },
    typography: {
      fontFamily: "'Outfit', 'Roboto', 'Arial', sans-serif",
      h4: {
        fontWeight: 600,
        fontSize: "1.8rem",
      },
      body1: {
        fontSize: "1rem",
        color:
          mode === "light"
            ? lightPalette.text.primary
            : darkPalette.text.primary, // Adjust text color for modes
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
            backgroundColor: mode === "light" ? "#eceff1" : "#4d4d4d",
            "&:hover": {
              backgroundColor: mode === "light" ? "#eceff1" : "#4d4d4d",
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
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === "light"
                ? lightPalette.background.navbar // Use navbar color for light mode
                : darkPalette.background.navbar, // Use navbar color for dark mode
            backgroundImage: "none", // Remove the default gradient
          },
        },
      },
    },
  });
};

export default globalTheme;
