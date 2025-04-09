import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Dashboard() {
  const theme = useTheme(); // Access the theme
  const collections = [
    {
      name: "Collection A",
      description: "Description of Collection A",
      items: 10,
    },
    {
      name: "Collection B",
      description: "Description of Collection B",
      items: 25,
    },
    {
      name: "Collection C",
      description: "Description of Collection C",
      items: 15,
    },
  ];

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here you can manage your collections and track their details.
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {collections.map((collection, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {collection.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {collection.description}
                </Typography>
                <Typography variant="body2">
                  Items: {collection.items}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
