import React from "react";
import { Form, redirect } from "react-router";
import {
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuList,
} from "@mui/material";
import { userService } from "../user.service";

export async function userCreateAction({ request }) {
  await userService.refreshToken();
  const formData = await request.formData();
  let userDetails = Object.fromEntries(formData);
  console.log("User Details:", userDetails);
  await userService.create(userDetails);
  return redirect("/dashboard");
  //   return null; // Placeholder for now
}

export default function UserCreate() {
  const theme = useTheme(); // Access the theme
  const [role, setRole] = React.useState("Agent");

  function handleRoleChange(event) {
    setRole(event.target.value);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Create a New User
      </Typography>
      <Form
        method="post"
        id="create-user-form"
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Create User
          </Button>
          <TextField
            label="First Name"
            name="firstName"
            type="string"
            defaultValue="Homer"
            fullWidth
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            type="string"
            defaultValue="Simpson"
            fullWidth
            required
          />
          <TextField
            label="Email address"
            name="email"
            type="email"
            defaultValue="darryll@stillproud.com"
            fullWidth
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            defaultValue="newpassss"
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            defaultValue="newpassss"
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              name="role"
              id="role-select"
              value={role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuList value="Agent">Agent</MenuList>
              <MenuList value="Admin">Admin</MenuList>
              <MenuList value="Manager">Manager</MenuList>
            </Select>
          </FormControl>
        </Box>
      </Form>
    </Box>
  );
}
