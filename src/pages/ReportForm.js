import React from "react";
import { Box, TextField, Typography, Grid, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fields } from "../data/reportFields";

const ReportForm = () => {
  const theme = useTheme();
  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        Report Form
      </Typography>
      <form>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                placeholder="Enter value"
                variant="outlined"
                sx={{
                  ...theme.typography.body1,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ color: theme.palette.text.primary }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReportForm;
