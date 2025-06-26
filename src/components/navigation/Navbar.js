import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FolderIcon from "@mui/icons-material/Folder";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Tooltip from "@mui/material/Tooltip";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { Link, useNavigate } from "react-router";
import { useTheme } from "@mui/material/styles";
import { userService } from "../../services";
import { useAuthContext } from "../../context/AuthContext";

export default function Navbar({ isDarkTheme, onToggleTheme }) {
  // const { user } = useAuthContext();
  const theme = useTheme();
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [gettingStartedAnchor, setGettingStartedAnchor] = useState(null);
  // const [connectAnchor, setConnectAnchor] = useState(null);
  // const [solutionsAnchor, setSolutionsAnchor] = useState(null);
  // const [adminAnchor, setAdminAnchor] = useState(null);
  // const handleSolutionsOpen = (event) =>
  //   setSolutionsAnchor(event.currentTarget);
  // const handleSolutionsClose = () => setSolutionsAnchor(null);
  // const handleConnectOpen = (event) => setConnectAnchor(event.currentTarget);
  // const handleConnectClose = () => setConnectAnchor(null);
  // const handleAdminOpen = (event) => setAdminAnchor(event.currentTarget);
  // const handleAdminClose = () => setAdminAnchor(null);
  const navigate = useNavigate();

  // const handleMenuOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // const handleGettingStartedOpen = (event) =>
  //   setGettingStartedAnchor(event.currentTarget);
  // const handleGettingStartedClose = () => setGettingStartedAnchor(null);

  // const handleLogout = async () => {
  //   try {
  //     userService.logout();
  //     handleMenuClose();
  //     navigate("/user/login");
  //   } catch (error) {
  //     console.error("Logout failed:", error); // Log the error
  //     alert("Failed to log out. Please try again."); // Display a user-friendly message
  //   }
  // };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.palette.background.navbar,
        color: theme.palette.text.primary,
        backgroundImage: "none", // Explicitly remove the gradient
        width: "100%",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            color: theme.palette.text.primary,
          }}
        >
          <Box
            component="img"
            src={
              isDarkTheme
                ? "/images/logos/logo-dark-thin.png"
                : "/images/logos/logo-light-thin.png"
            }
            alt="Monochrome Compliance Logo"
            sx={{
              height: 48,
              objectFit: "contain",
              mt: 1.5,
              mb: 0.5,
              ml: -1.5,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
            onClick={() => {
              navigate("/");
            }}
          />
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/faq"
          sx={{ color: theme.palette.text.primary }}
        >
          FAQ
        </Button>
        <IconButton
          sx={{ ml: 1, color: theme.palette.text.primary }}
          onClick={onToggleTheme}
          color="inherit"
          aria-label="toggle theme"
        >
          {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
