import config from "../utils/config";
import { fetchWrapper } from "../utils/fetch-wrapper";

const baseUrl = `${config.apiUrl}/ptrs`;

export const ptrsService = {
  getAll,
  getAllByReportId,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await fetchWrapper.get(baseUrl);
}

async function getAllByReportId(reportId) {
  return await fetchWrapper.get(`${baseUrl}/report/${reportId}`);
}

async function getById(id) {
  return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function create(params) {
  return await fetchWrapper.post(baseUrl, params);
}

async function update(id, params) {
  return await fetchWrapper.put(`${baseUrl}/${id}`, params);
}

async function _delete(id) {
  return await fetchWrapper.delete(`${baseUrl}/${id}`);
}
