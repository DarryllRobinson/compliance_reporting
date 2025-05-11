import config from "../utils/config";
import { fetchWrapper } from "../utils/fetch-wrapper";

const baseUrl = `${config.apiUrl}/entities`;

export const entityService = {
  getAll,
  getById,
  create,
  sendPdfEmail,
  update,
  delete: _delete,
};

async function getAll() {
  return await fetchWrapper.get(baseUrl);
}

async function getById(id) {
  return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function create(params) {
  return await fetchWrapper.post(baseUrl, params);
}

async function sendPdfEmail(formData, isFormData = false) {
  try {
    // Log FormData contents for debugging
    // if (isFormData) {
    //   for (let pair of formData.entries()) {
    //     console.log(pair[0], pair[1]);
    //   }
    // }

    const config = {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    };

    const response = await fetchWrapper.postEmail(
      `${baseUrl}/send-email`, // Replace with your actual API endpoint
      formData,
      config
    );
    // const response = { data: { success: true } }; // Mock response for testing

    return response.data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

async function update(id, params) {
  return await fetchWrapper.put(`${baseUrl}/${id}`, params);
}

async function _delete(id) {
  return await fetchWrapper.delete(`${baseUrl}/${id}`);
}
