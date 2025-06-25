import { createTheme } from "@mui/material/styles";

// Palette
// Lightest: #ffffff
// Light: #eceff1
// Dark: #4d4d4d
// Darkest: #141414

// New Palette?
// Lightest: #f1f0f0
// Light: #eceff1
// Dark: #4d4d4d
// Darkest: #222323

const lightPalette = {
  primary: {
    main: "#f1f0f0", // Lightest for primary color
  },
  secondary: {
    main: "#eceff1", // Light for secondary color
  },
  background: {
    default: "#eceff1", // Lightest for default background
    paper: "#f1f0f0", // Light for paper background
    navbar: "#eceff1", // Light for navbar background
  },
  text: {
    primary: "#4d4d4d", // Darkest for primary text
    secondary: "#222323", // Dark for secondary text
  },
  action: {
    hoverOpacity: 0.8, // Ensure hoverOpacity is defined
  },
};

const darkPalette = {
  primary: {
    main: "#4d4d4d", // Darkest for primary color
  },
  secondary: {
    main: "#222323", // Dark for secondary color
  },
  background: {
    default: "#4d4d4d", // Darkest for default background
    paper: "#222323", // Dark for paper background
    navbar: "#4d4d4d", // Dark for navbar background
  },
  text: {
    primary: "#eceff1", // Lightest for primary text
    secondary: "#f1f0f0", // Light for secondary text
  },
  action: {
    hoverOpacity: 0.8, // Ensure hoverOpacity is defined
  },
};

const _lightPalette = {
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

const _darkPalette = {
  primary: {
    main: "#141414", // Darkest for primary color
  },
  secondary: {
    main: "#4d4d4d", // Dark for secondary color
  },
  background: {
    default: "#141414", // Darkest for default background
    paper: "#4d4d4d", // Dark for paper background
    navbar: "#4d4d4d", // Dark for navbar background
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
            backgroundColor: mode === "light" ? "#bbdefb" : "#1565c0",
            // backgroundColor: mode === "light" ? "#e3f2fd" : "#1565c0",
            "&:hover": {
              backgroundColor: mode === "light" ? "#e3f2fd" : "#1e88e5",
              // backgroundColor: mode === "light" ? "#bbdefb" : "#1e88e5",
            },
          },
          outlined: {
            borderColor:
              mode === "light"
                ? lightPalette.primary.main
                : darkPalette.primary.main,
            color:
              mode === "light"
                ? lightPalette.text.secondary
                : darkPalette.text.secondary,
            "&:hover": {
              borderColor:
                mode === "light"
                  ? lightPalette.text.secondary
                  : darkPalette.text.secondary,
              backgroundColor: mode === "light" ? "#e8f5e9" : "#2e7d32",
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
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor:
                mode === "light"
                  ? lightPalette.text.primary
                  : darkPalette.text.primary,
              borderWidth: "1.5px",
            },
          },
          notchedOutline: {
            borderColor:
              mode === "light"
                ? lightPalette.text.secondary
                : darkPalette.text.secondary,
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
