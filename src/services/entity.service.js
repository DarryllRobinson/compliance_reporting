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
    const response = await fetchWrapper.postEmail(
      `${baseUrl}/send-email`,
      formData
    );
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
