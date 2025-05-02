import config from "../utils/config";
import { fetchWrapper } from "../utils/fetch-wrapper";

const baseUrl = `${config.apiUrl}/tcp`;

export const tcpService = {
  getAll,
  getAllByReportId,
  getById,
  bulkCreate,
  bulkUpdate,
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

async function bulkCreate(params) {
  return await fetchWrapper.post(baseUrl, params);
}

async function bulkUpdate(params) {
  return await fetchWrapper.put(baseUrl, params);
}

async function _delete(id) {
  return await fetchWrapper.delete(`${baseUrl}/${id}`);
}
