import { Box, CircularProgress } from "@mui/material";

export default function Fallback() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress size="3rem" />
    </Box>
  );
}
