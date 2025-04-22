import React from "react";
import { Button } from "@mui/material";
import { useAlert } from "../../context/AlertContext";

export default function ExampleComponent() {
  const { sendAlert } = useAlert();

  return (
    <Button
      variant="contained"
      onClick={() => sendAlert("success", "This is a success alert!")}
    >
      Trigger Alert
    </Button>
  );
}
