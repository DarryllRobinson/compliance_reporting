export const calculatePaymentTime = (record) => {
  const {
    rcti,
    invoiceIssueDate,
    invoiceReceiptDate,
    paymentDate,
    noticeForPaymentIssueDate,
    supplyDate,
  } = record;

  const parseDate = (date) => (date ? new Date(date) : null);
  const daysBetween = (start, end) =>
    start && end
      ? Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
      : null;

  const paymentDateParsed = parseDate(paymentDate);

  if (rcti) {
    // Condition 1: RCTI
    return daysBetween(parseDate(invoiceIssueDate), paymentDateParsed);
  } else if (invoiceIssueDate || invoiceReceiptDate) {
    // Condition 2: Regular Invoice
    const issueDays = daysBetween(
      parseDate(invoiceIssueDate),
      paymentDateParsed
    );
    const receiptDays = daysBetween(
      parseDate(invoiceReceiptDate),
      paymentDateParsed
    );
    return Math.min(issueDays ?? Infinity, receiptDays ?? Infinity);
  } else if (noticeForPaymentIssueDate) {
    // Condition 3: Notice for Payment
    return daysBetween(parseDate(noticeForPaymentIssueDate), paymentDateParsed);
  } else {
    // Condition 4: Supply Date
    return daysBetween(parseDate(supplyDate), paymentDateParsed);
  }
};
