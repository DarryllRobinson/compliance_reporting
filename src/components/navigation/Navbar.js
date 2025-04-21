import React, { useState } from "react";
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
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link, useNavigate } from "react-router";
import { useTheme } from "@mui/material/styles";
import { userService } from "../../features/users/user.service";

export default function Navbar({ isDarkTheme, onToggleTheme }) {
  const user = userService.userValue; // Get the current user
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
        backgroundColor: isDarkTheme
          ? theme.palette.background.paper
          : theme.palette.primary.main,
        color: isDarkTheme
          ? theme.palette.text.primary
          : theme.palette.common.white,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: theme.palette.text.primary }}
        >
          Placeholder Logo
        </Typography>
        {user ? ( // Check if user exists
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{ color: theme.palette.text.primary }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/user/dashboard"
              sx={{ color: theme.palette.text.primary }}
            >
              Dashboard
            </Button>
            {user.role === "Admin" && (
              <Button
                color="inherit"
                component={Link}
                to="/clients"
                sx={{ color: theme.palette.text.primary }}
              >
                Clients
              </Button>
            )}
            {user.role === "Admin" && (
              <Button
                color="inherit"
                component={Link}
                to="/users"
                sx={{ color: theme.palette.text.primary }}
              >
                Users
              </Button>
            )}
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ color: theme.palette.text.primary }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              color="inherit"
              component={Link}
              to="/user/login"
              sx={{ color: theme.palette.text.primary }}
            >
              Login
            </Button>
          </Box>
        )}
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
              to="/"
              sx={{ color: theme.palette.text.primary }}
            >
              Home
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/user/dashboard"
              sx={{ color: theme.palette.text.primary }}
            >
              Dashboard
            </MenuItem>
            {user?.role === "Admin" && (
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/clients"
                sx={{ color: theme.palette.text.primary }}
              >
                Clients
              </MenuItem>
            )}
            {user?.role === "Admin" && (
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/users"
                sx={{ color: theme.palette.text.primary }}
              >
                Users
              </MenuItem>
            )}
            {user
              ? [
                  <MenuItem
                    key="logout"
                    onClick={handleLogout}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    Logout
                  </MenuItem>,
                ]
              : [
                  <MenuItem
                    key="login"
                    onClick={handleMenuClose}
                    component={Link}
                    to="/user/login"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    Login
                  </MenuItem>,
                ]}
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
