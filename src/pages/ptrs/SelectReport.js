import React from "react";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import { useNavigate } from "react-router";

const SelectReport = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Select a Compliance Report
      </Typography>
      <List>
        <ListItem>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => navigate("/xero-credentials")}
          >
            Payment Times Reporting Scheme
          </Button>
        </ListItem>
        <ListItem>
          <Button fullWidth variant="outlined" color="secondary">
            Placeholder Report 1
          </Button>
        </ListItem>
        <ListItem>
          <Button fullWidth variant="outlined" color="secondary">
            Placeholder Report 2
          </Button>
        </ListItem>
        <ListItem>
          <Button fullWidth variant="outlined" color="secondary">
            Placeholder Report 3
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};

export default SelectReport;
