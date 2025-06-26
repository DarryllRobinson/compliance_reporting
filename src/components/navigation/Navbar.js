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
// import { useAuthContext } from "../../context/AuthContext";

export default function Navbar({ isDarkTheme, onToggleTheme }) {
  // const { user } = useAuthContext();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [gettingStartedAnchor, setGettingStartedAnchor] = useState(null);
  const [connectAnchor, setConnectAnchor] = useState(null);
  const [solutionsAnchor, setSolutionsAnchor] = useState(null);
  const [adminAnchor, setAdminAnchor] = useState(null);
  const handleSolutionsOpen = (event) =>
    setSolutionsAnchor(event.currentTarget);
  const handleSolutionsClose = () => setSolutionsAnchor(null);
  const handleConnectOpen = (event) => setConnectAnchor(event.currentTarget);
  const handleConnectClose = () => setConnectAnchor(null);
  const handleAdminOpen = (event) => setAdminAnchor(event.currentTarget);
  const handleAdminClose = () => setAdminAnchor(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGettingStartedOpen = (event) =>
    setGettingStartedAnchor(event.currentTarget);
  const handleGettingStartedClose = () => setGettingStartedAnchor(null);

  const handleLogout = async () => {
    try {
      userService.logout();
      handleMenuClose();
      navigate("/user/login");
    } catch (error) {
      console.error("Logout failed:", error); // Log the error
      alert("Failed to log out. Please try again."); // Display a user-friendly message
    }
  };

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
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {/* PTRS task-related items: Admin, Dashboard, Logout (for logged-in), Login (for guests) */}

          {/* Solutions, Getting Started, Connect - moved after user/admin/dashboard/logout/login */}
          <Button
            color="inherit"
            onClick={handleSolutionsOpen}
            sx={{
              color: theme.palette.text.primary,
              display: "flex",
              alignItems: "center",
            }}
            endIcon={<ExpandMoreIcon />}
          >
            Solutions
          </Button>
          <Menu
            anchorEl={solutionsAnchor}
            open={Boolean(solutionsAnchor)}
            onClose={handleSolutionsClose}
            sx={{ mt: 1 }}
          >
            <MenuItem
              onClick={handleSolutionsClose}
              component={Link}
              to="/payment-times-reporting"
            >
              <InfoIcon sx={{ fontSize: 20, mr: 1 }} />
              PTR Solution
            </MenuItem>
            <Divider />
            <Tooltip
              title="Coming soon"
              placement="bottom"
              arrow
              enterDelay={300}
              leaveDelay={100}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -20],
                    },
                  },
                ],
              }}
            >
              <Box
                component="li"
                sx={{
                  listStyle: "none",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  opacity: 0.5,
                  cursor: "default",
                  pointerEvents: "auto",
                }}
              >
                <HourglassEmptyIcon sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="body2">Data Cleanser</Typography>
              </Box>
            </Tooltip>
            <Tooltip
              title="Coming soon"
              placement="bottom"
              arrow
              enterDelay={300}
              leaveDelay={10}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -20],
                    },
                  },
                ],
              }}
            >
              <Box
                component="li"
                sx={{
                  listStyle: "none",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  opacity: 0.5,
                  cursor: "default",
                  pointerEvents: "auto",
                }}
              >
                <HourglassEmptyIcon sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="body2">Sustainability Report</Typography>
              </Box>
            </Tooltip>
          </Menu>
          <Button
            color="inherit"
            onClick={handleGettingStartedOpen}
            sx={{
              color: theme.palette.text.primary,
              display: "flex",
              alignItems: "center",
            }}
            endIcon={<ExpandMoreIcon />}
          >
            Getting Started
          </Button>
          <Menu
            anchorEl={gettingStartedAnchor}
            open={Boolean(gettingStartedAnchor)}
            onClose={handleGettingStartedClose}
            sx={{ mt: 1 }}
          >
            <MenuItem
              onClick={handleGettingStartedClose}
              component={Link}
              to="/overview"
            >
              <InfoIcon sx={{ fontSize: 20, mr: 1 }} />
              Overview
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleGettingStartedClose}
              component={Link}
              to="/resources"
            >
              <FolderIcon sx={{ fontSize: 20, mr: 1 }} />
              Resources
            </MenuItem>
            <MenuItem
              onClick={handleGettingStartedClose}
              component={Link}
              to="/faq"
            >
              <HelpOutlineIcon sx={{ fontSize: 20, mr: 1 }} />
              FAQ
            </MenuItem>
          </Menu>
          <Button
            color="inherit"
            onClick={handleConnectOpen}
            sx={{
              color: theme.palette.text.primary,
              display: "flex",
              alignItems: "center",
            }}
            endIcon={<ExpandMoreIcon />}
          >
            Connect
          </Button>
          <Menu
            anchorEl={connectAnchor}
            open={Boolean(connectAnchor)}
            onClose={handleConnectClose}
            sx={{ mt: 1 }}
          >
            <MenuItem
              onClick={handleConnectClose}
              component={Link}
              to="/contact"
            >
              <InfoIcon sx={{ fontSize: 20, mr: 1 }} />
              Contact
            </MenuItem>
            <MenuItem
              onClick={handleConnectClose}
              component={Link}
              to="/contact"
            >
              <HourglassEmptyIcon sx={{ fontSize: 20, mr: 1 }} />
              Join the Waitlist
            </MenuItem>
            <MenuItem
              onClick={handleConnectClose}
              component={Link}
              to="/booking"
            >
              <FolderIcon sx={{ fontSize: 20, mr: 1 }} />
              Booking
            </MenuItem>
            <MenuItem onClick={handleConnectClose} component={Link} to="/blog">
              <HelpOutlineIcon sx={{ fontSize: 20, mr: 1 }} />
              Blog
            </MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ color: theme.palette.text.primary }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ backgroundColor: theme.palette.background.paper }}
          >
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/payment-times-reporting"
              sx={{ color: theme.palette.text.primary }}
            >
              PTR Solution
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/overview"
              sx={{ color: theme.palette.text.primary }}
            >
              Getting Started
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/resources"
              sx={{ color: theme.palette.text.primary }}
            >
              Resources
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/faq"
              sx={{ color: theme.palette.text.primary }}
            >
              FAQ
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/contact"
              sx={{ color: theme.palette.text.primary }}
            >
              Contact
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/contact"
              sx={{ color: theme.palette.text.primary }}
            >
              Join the Waitlist
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/booking"
              sx={{ color: theme.palette.text.primary }}
            >
              Booking
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/blog"
              sx={{ color: theme.palette.text.primary }}
            >
              Blog
            </MenuItem>
            {/* Dashboard menu item for logged-in users */}
          </Menu>
        </Box>
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
