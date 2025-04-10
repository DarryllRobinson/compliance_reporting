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
  MenuItem,
} from "@mui/material";
import { userService } from "../../features/users/user.service";
import { clientService } from "./client.service";

export async function clientRegisterAction({ request }) {
  await userService.refreshToken();
  const formData = await request.formData();
  let clientDetails = Object.fromEntries(formData);
  console.log("Client Details:", clientDetails);
  await clientService.create(clientDetails);
  return redirect("/user-create");
}

export default function ClientRegister() {
  const theme = useTheme(); // Access the theme

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
        Register a New Client
      </Typography>
      <Form
        method="post"
        id="register-client-form"
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Client Name"
            name="clientName"
            type="string"
            defaultValue="Acme Corp"
            fullWidth
            required
          />
          <TextField
            label="ABN"
            name="abn"
            type="string"
            defaultValue="12345678901"
            fullWidth
            required
          />
          <TextField
            label="ACN"
            name="acn"
            type="string"
            defaultValue="987654321"
            fullWidth
          />
          <TextField
            label="Contact Name"
            name="contactName"
            type="string"
            defaultValue="John Doe"
            fullWidth
            required
          />
          <TextField
            label="Contact Email"
            name="contactEmail"
            type="email"
            defaultValue="contact@acme.com"
            fullWidth
            required
          />
          <TextField
            label="Contact Phone"
            name="contactPhone"
            type="string"
            defaultValue="0412345678"
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel id="industry-code-select-label">
              Industry Code
            </InputLabel>
            <Select
              labelId="industry-code-select-label"
              name="industryCode"
              id="industry-code-select"
              label="Industry Code"
              defaultValue=""
              required
            >
              <MenuItem value="111">111</MenuItem>
              <MenuItem value="222">222</MenuItem>
              <MenuItem value="333">333</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Register Client
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
