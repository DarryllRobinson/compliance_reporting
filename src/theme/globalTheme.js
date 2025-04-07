import { createTheme } from "@mui/material/styles";

const globalTheme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    fontSize: 14,
    h3: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

export default globalTheme;
