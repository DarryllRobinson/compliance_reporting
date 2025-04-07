import { Link as RouterLink } from "react-router";
import { Link, Typography } from "@mui/material";

function Footer(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link component={RouterLink} color="inherit" href="#">
        Compliance Reporting Inc. All rights reserved.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
      <Link component={RouterLink} color="inherit" href="#">
        Legal
      </Link>
      <Link component={RouterLink} color="inherit" href="#">
        Privacy
      </Link>
      <Link component={RouterLink} color="inherit" href="#">
        Terms
      </Link>
    </Typography>
  );
}

export default Footer;
