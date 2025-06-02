import { fetchWrapper } from "../../lib/utils/fetch-wrapper";

const baseUrl = `${process.env.REACT_APP_API_URL}/xero`;

export const xeroService = {
  connect,
  fetchData,
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
