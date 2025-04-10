import React from "react";
import { userService } from "../users/user.service";
import { clientService } from "./client.service";
import { useLoaderData } from "react-router";
import { useTheme } from "@mui/material";

export async function clientsLoader() {
  const user = await userService.refreshToken();
  if (!user) {
    throw new Response("clientsLoader user problem", { status: 500 });
  }
  const clients = await clientService.getAll();
  if (!clients) {
    throw new Response("clientsLoader clients problem", { status: 500 });
  }
  return { clients };
}

export default function Clients() {
  const { clients } = useLoaderData();
  console.log("clients: ", clients);
  const theme = useTheme();

  return (
    <div>
      <h1>Clients</h1>
      <p>This is the Clients page.</p>
    </div>
  );
}
