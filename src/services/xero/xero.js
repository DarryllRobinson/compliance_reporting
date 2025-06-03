import { fetchWrapper } from "../../lib/utils/fetch-wrapper";

const baseUrl = `${process.env.REACT_APP_API_URL}/xero`;
const wsBaseUrl = process.env.REACT_APP_WS_API_URL;

export const xeroService = {
  connect,
  fetchData,
  subscribeToProgressUpdates,
};

function connect(params) {
  console.log("Connecting to Xero with params:", params);
  const { reportId } = params;
  return fetchWrapper.get(`${baseUrl}/connect/${reportId}`);
}

function fetchData(params) {
  console.log("Fetching Xero data with updates...");
  return fetchWrapper.get(`${baseUrl}/data`, params);
}

function subscribeToProgressUpdates(onMessage, onError, onClose) {
  const ws = new WebSocket(wsBaseUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({ action: "subscribe", type: "xeroUpdates" }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch (err) {
      console.error("WebSocket message parse error:", err);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    if (onError) onError(error);
  };

  ws.onclose = () => {
    console.log("WebSocket closed.");
    if (onClose) onClose();
  };

  return ws;
}
