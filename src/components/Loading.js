import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

const Loading = ({ message = "Loading..." }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      padding={theme.spacing(4)}
      sx={{ animation: `${fadeIn} 0.6s ease-in-out` }}
    >
      <CircularProgress color="primary" />
      <Typography variant="body1" color="textSecondary" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
