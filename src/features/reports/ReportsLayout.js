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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { Outlet } from "react-router";
import StepsOverview from "./ptrs/StepsOverview"; // Import StepsOverview

const drawerWidth = 240;

export default function ReportsLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      {/* <AppBar
        position="fixed" // Keep AppBar fixed
        sx={{
          width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          ml: isDrawerOpen ? `${drawerWidth}px` : 0,
          mt: "72px", // Add top margin to account for the navbar height
          transition: "width 0.3s ease, margin-left 0.3s ease", // Smooth transition
          zIndex: (theme) => theme.zIndex.drawer - 1, // Ensure AppBar is below the navbar
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {isDrawerOpen ? <CloseIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            PTRS Process Flow
          </Typography>
        </Toolbar>
      </AppBar> */}

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
          p: 2,
          mt: "72px", // Add top margin to account for the navbar height
          width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          transition: "width 0.3s ease", // Smooth transition
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
