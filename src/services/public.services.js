import config from "../utils/config";
import { fetchWrapper } from "../utils/fetch-wrapper";

const baseUrl = `${config.apiUrl}/public`;

export const publicService = {
  sendEmail,
};

async function sendEmail(formData) {
  return await fetchWrapper.post(`${baseUrl}/send-email`, formData);
}
