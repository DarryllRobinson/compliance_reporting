import config from "../utils/config";
import { fetchWrapper } from "../utils/fetch-wrapper";

const baseUrl = `${config.apiUrl}/tcp`;

export const tcpService = {
  getAll,
  getAllByReportId,
  getTcpByReportId,
  sbiUpdate,
  partialUpdate,
  getById,
  bulkCreate,
  bulkUpdate,
  delete: _delete,
  getIncompleteSmallBusinessFlags,
  submitFinalReport,
};

async function getAll() {
  return await fetchWrapper.get(baseUrl);
}

async function getAllByReportId(reportId) {
  return await fetchWrapper.get(`${baseUrl}/report/${reportId}`);
}

async function getTcpByReportId(reportId) {
  return await fetchWrapper.get(`${baseUrl}/tcp/${reportId}`);
}

async function sbiUpdate(reportId, params) {
  return await fetchWrapper.put(`${baseUrl}/sbi/${reportId}`, params);
}

async function partialUpdate(params) {
  return await fetchWrapper.put(`${baseUrl}/partial`, params);
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

async function getIncompleteSmallBusinessFlags() {
  return await fetchWrapper.get(`${baseUrl}/missing-isSb`);
}

async function submitFinalReport() {
  return await fetchWrapper.put(`${baseUrl}/submit-final`);
}
