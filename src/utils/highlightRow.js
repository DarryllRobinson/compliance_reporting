/**
 * Determines the background color for a table row based on its state.
 * @param {Object} record - The record object.
 * @param {Object} changedRows - The map of changed rows with their states.
 * @param {boolean} showPartialPaymentsOnly - Whether the partial payment filter is active.
 * @returns {string} - The background color for the row.
 */
export function getRowHighlightColor(
  record,
  changedRows,
  showPartialPaymentsOnly
) {
  const isChanged = changedRows[record.id] === "unsaved";
  const isSaved =
    changedRows[record.id] === "saved" ||
    new Date(record.updatedAt) > new Date(record.createdAt);
  const isError = changedRows[record.id] === "error";
  const isPartialPayment = record.partialPayment && showPartialPaymentsOnly;

  if (isError) return "rgba(255, 0, 0, 0.1)"; // Red for save errors
  if (isChanged) return "rgba(255, 165, 0, 0.3)"; // Orange for unsaved changes
  if (isSaved) return "rgba(0, 255, 0, 0.1)"; // Green for saved or updated records
  if (isPartialPayment) return "rgba(0, 0, 255, 0.1)"; // Blue for partial payments (filtered view only)
  return "inherit"; // Default background color
}
