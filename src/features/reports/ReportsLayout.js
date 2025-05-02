import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Outlet, redirect } from "react-router";
import ProtectedRoutes from "../../utils/ProtectedRoutes";
import StepsOverview from "./ptrs/StepsOverview"; // Import StepsOverview

const drawerWidth = 240;

export function reportLayoutLoader() {
  if (!ProtectedRoutes()) {
    return redirect("/user/dashboard");
  }
}

export default function ReportsLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed" // Keep AppBar fixed
        sx={{
          width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          ml: isDrawerOpen ? `${drawerWidth}px` : 0,
          mt: "64px", // Add top margin to account for the navbar height
          transition: "width 0.3s ease, margin-left 0.3s ease", // Smooth transition
          zIndex: (theme) => theme.zIndex.drawer - 1, // Ensure AppBar is below the navbar
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            PTRS Process Flow
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: isDrawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "width 0.3s ease", // Smooth transition
            overflowX: isDrawerOpen ? "visible" : "hidden", // Hide content when closed
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem>
            <ListItemText primary="Steps Overview" />
          </ListItem>
          <StepsOverview /> {/* Render StepsOverview inside the sidebar */}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // Add top margin to account for the navbar height
          width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          transition: "width 0.3s ease", // Smooth transition
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
