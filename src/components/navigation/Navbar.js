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
import { Link } from "react-router";
import { useTheme } from "@mui/material/styles";
import { userService } from "../../features/users/user.service";

export default function Navbar({ isDarkTheme, onToggleTheme }) {
  const user = userService.userValue;
  // console.log("User in Navbar:", user);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
        {user && (
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
              to="/select-report"
              sx={{ color: theme.palette.text.primary }}
            >
              Report Selection
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
          </Box>
        )}
        {!user && (
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              color="inherit"
              component={Link}
              to="/signin"
              sx={{ color: theme.palette.text.primary }}
            >
              Sign In
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/signup"
              sx={{ color: theme.palette.text.primary }}
            >
              Sign Up
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
              to="/select-report"
              sx={{ color: theme.palette.text.primary }}
            >
              Report Selection
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/review"
              sx={{ color: theme.palette.text.primary }}
            >
              Report Review
            </MenuItem>
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
