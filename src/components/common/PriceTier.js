import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  useTheme,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router";
import { keyframes } from "@mui/system";

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, 10%) scale(1.1);
  }
  70% {
    transform: translate(-50%, -5%) scale(0.95);
  }
  100% {
    transform: translate(-50%, 0) scale(1);
  }
`;

const wiggle = keyframes`
  0% { transform: rotate(-45deg) translateX(0); }
  25% { transform: rotate(-45deg) translateX(-2px); }
  50% { transform: rotate(-45deg) translateX(2px); }
  75% { transform: rotate(-45deg) translateX(-1px); }
  100% { transform: rotate(-45deg) translateX(0); }
`;

const tiers = [
  {
    title: "DIY",
    price: "$4,990",
    originalPrice: "$5,990",
    discountPercentage: 17,
    description: [
      "Upload and process payment data",
      "Apply compliance rules",
      "Export PTR submission",
      "Basic email support",
    ],
    buttonText: "Get Started",
    buttonVariant: "contained",
  },
  {
    title: "Plus",
    price: "$9,990",
    originalPrice: "$12,990",
    discountPercentage: 23,
    mostPopular: true,
    description: [
      "Everything in DIY",
      "Small business uplift tool",
      "Manual reviews & recommendations",
      "In-app chat support",
    ],
    buttonText: "Upgrade to Plus",
    buttonVariant: "contained",
  },
  {
    title: "Premium",
    price: "Price on request",
    description: [
      "Everything in Plus",
      "Dedicated compliance specialist",
      "Ongoing data monitoring",
      "Priority support",
      "Custom reporting & audit trail",
    ],
    buttonText: "Contact Us",
    buttonVariant: "contained",
  },
];

export default function PriceTier() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 6,
        backgroundColor: theme.palette.background.default,
        px: { xs: 2, sm: 0 },
        overflow: "visible",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Pricing Plans
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
        gutterBottom
        sx={{ zIndex: 10 }}
      >
        Choose the level of support that’s right for your business
      </Typography>
      <Grid container spacing={1} justifyContent="center" sx={{ mt: 4 }}>
        {tiers.map((tier) => (
          <Grid
            item
            key={tier.title}
            xs={12}
            sm="auto"
            sx={{ width: 180, flexShrink: 0, overflow: "visible" }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
                // Reset then reapply animation on hover for [data-ribbon]
                "&:hover [data-ribbon]": {
                  animation: `${wiggle} 1s ease-in-out 3`,
                },
                position: "relative",
                overflow: "visible",
              }}
            >
              {tier.mostPopular && (
                <Box
                  className="ribbon"
                  data-ribbon
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: -40,
                    backgroundColor: theme.palette.warning.main,
                    color: theme.palette.getContrastText(
                      theme.palette.warning.main
                    ),
                    px: 2,
                    py: 0.5,
                    transform: "rotate(-45deg)",
                    fontWeight: "bold",
                    fontSize: 12,
                    boxShadow: 3,
                    zIndex: 5,
                    width: 160,
                    textAlign: "center",
                    animation: `${wiggle} 1s ease-in-out 3`,
                  }}
                >
                  <StarIcon
                    sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }}
                  />
                  Most Popular
                </Box>
              )}
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {tier.title}
                </Typography>
                <Box
                  sx={{
                    height: 3,
                    width: 200,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 2,
                    mx: "auto",
                    mb: 2,
                  }}
                />
                <ul>
                  {tier.description.map((line, index) => (
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="left"
                      key={index}
                    >
                      {line}
                    </Typography>
                  ))}
                </ul>
                {tier.originalPrice && (
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      textDecoration: "line-through",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {tier.originalPrice}
                  </Typography>
                )}
                {tier.discountPercentage && (
                  <Chip
                    label={`${tier.discountPercentage}% off`}
                    color="success"
                    size="small"
                    sx={{ mx: "auto", mt: 1 }}
                  />
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" align="center">
                    {tier.price}
                  </Typography>
                </Box>
              </CardContent>
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  component={Link}
                  to="/register"
                >
                  {tier.buttonText}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
