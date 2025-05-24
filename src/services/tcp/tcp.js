import config from "../../lib/utils/config";
import { fetchWrapper } from "../../lib/utils/fetch-wrapper";

const baseUrl = `${config.apiUrl}/tcp`;

export const tcpService = {
  getAll,
  getAllByReportId,
  patchRecord,
  patchRecords,
  getTcpByReportId,
  sbiUpdate,
  partialUpdate,
  getById,
  bulkCreate,
  bulkUpdate,
  delete: _delete,
  getIncompleteSmallBusinessFlags,
  submitFinalReport,
  downloadSummaryReport,
};

async function getAll() {
  return await fetchWrapper.get(baseUrl);
}

async function getAllByReportId(reportId) {
  return await fetchWrapper.get(`${baseUrl}/report/${reportId}`);
}

async function patchRecord(id, updates) {
  return fetchWrapper.patch(`${baseUrl}/${id}`, updates);
}

async function patchRecords(updates) {
  return fetchWrapper.patch(`${baseUrl}/bulk-patch`, updates);
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

async function downloadSummaryReport() {
  return await fetchWrapper.get(`${baseUrl}/download-summary`, null, "blob");
}
