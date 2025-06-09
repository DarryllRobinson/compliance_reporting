import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import { Box } from "@mui/system";
import DownloadIcon from "@mui/icons-material/Download";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Link } from "react-router";

export default function ResourcePage() {
  const resources = [
    {
      title: "CSV Template",
      description:
        "Use this to format your payment data correctly before upload.",
      link: "/templates/ptr_template.csv",
      available: true,
    },
    {
      title: "Submission Checklist",
      description:
        "A step-by-step guide to double-check your data before submitting.",
      link: "/resources/submission-checklist",
      available: true,
    },
    {
      title: "Sample Completed Report",
      description: "An example of a correctly prepared report for reference.",
      available: false,
    },
    {
      title: "Guide to SBI Tool",
      description:
        "Instructions for using the Small Business Identification tool.",
      available: false,
    },
  ];

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Resources & Downloads
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Tools and templates to help you complete your reporting with confidence.
      </Typography>
      <Grid container spacing={4} alignItems="stretch">
        {resources.map((res, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box height="100%">
              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{res.title}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {res.description}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2,
                    mt: "auto",
                  }}
                >
                  {res.available ? (
                    res.link.endsWith(".csv") ? (
                      <Button
                        size="small"
                        variant="contained"
                        href={res.link}
                        target="_blank"
                        rel="noopener"
                        startIcon={<DownloadIcon />}
                        download
                      >
                        Download
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        component={Link}
                        to={res.link}
                      >
                        View
                      </Button>
                    )
                  ) : (
                    <Chip
                      icon={<HourglassEmptyIcon />}
                      label="Coming Soon"
                      variant="outlined"
                      color="default"
                    />
                  )}
                </CardActions>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
