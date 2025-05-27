import { fetchWrapper } from "../../lib/utils/";

const baseUrl = `${process.env.REACT_APP_API_URL}/public`;

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
