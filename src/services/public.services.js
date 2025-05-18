import config from "../utils/config";
import { fetchWrapper } from "../utils/fetch-wrapper";

const baseUrl = `${config.apiUrl}/public`;

export const publicService = {
  sendEmail,
  sendAttachmentEmail,
};

async function sendEmail(formData) {
  return await fetchWrapper.post(`${baseUrl}/send-email`, formData);
}

async function sendAttachmentEmail(formData, isFormData = false) {
  try {
    const response = await fetchWrapper.postEmail(
      `${baseUrl}/send-attachment-email`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
