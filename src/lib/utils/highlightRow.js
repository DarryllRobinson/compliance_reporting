/**
 * Determines the background color for a table row based on its state.
 * @param {Object} record - The record object.
 * @returns {string} - The background color for the row.
 */
export function getRowHighlightColor(record) {
  if (record.isError) return "rgba(255, 0, 0, 0.1)";
  if (record.wasChanged) return "rgba(255, 165, 0, 0.3)";
  if (record.wasSaved) return "rgba(0, 255, 0, 0.1)";
  if (record.partialPayment) return "rgba(0, 0, 255, 0.1)";
  return "inherit";
}
