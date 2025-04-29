export const mockInvoices = Array.from({ length: 1000 }, (_, index) => {
  const invoiceNumber = `INV${String(index + 1).padStart(4, "0")}`;
  const payerEntityName = `Payer ${index + 1}`;
  const payerEntityABN = String(10000000000 + index).padStart(11, "0");
  const payerEntityACNARBN =
    index % 2 === 0 ? String(100000000 + index).padStart(9, "0") : null;
  const payeeEntityName = `Payee ${index + 1}`;
  const payeeEntityABN = String(20000000000 + index).padStart(11, "0");
  const payeeEntityACNARBN =
    index % 3 === 0 ? String(300000000 + index).padStart(9, "0") : null;
  const paymentAmount = (Math.random() * 5000 + 500).toFixed(2);
  const description = `Description for invoice ${invoiceNumber}`;
  const supplyDate = new Date(2024, index % 12, (index % 28) + 1)
    .toISOString()
    .split("T")[0];
  const paymentDate =
    index % 4 !== 0
      ? new Date(2024, (index % 12) + 1, (index % 28) + 5)
          .toISOString()
          .split("T")[0]
      : null;
  const contractPOReferenceNumber = `PO${String(index + 1).padStart(6, "0")}`;
  const contractPOPaymentTerms = [30, 45, 60, 90][index % 4];
  const noticeForPaymentIssueDate = new Date(2024, index % 12, (index % 28) + 2)
    .toISOString()
    .split("T")[0];
  const noticeForPaymentTerms = [15, 30, 45, 60][index % 4];
  const invoiceReferenceNumber = invoiceNumber;
  const invoiceIssueDate = new Date(2024, index % 12, (index % 28) + 1)
    .toISOString()
    .split("T")[0];
  const invoiceReceiptDate = new Date(2024, index % 12, (index % 28) + 3)
    .toISOString()
    .split("T")[0];
  const invoicePaymentTerms = [30, 45, 60, 90][index % 4];
  const invoiceDueDate = new Date(2024, (index % 12) + 1, (index % 28) + 1)
    .toISOString()
    .split("T")[0];
  const tradeCreditPayment = index % 4 !== 0; // 75% paid, 25% unpaid

  // Example of multiple payments for some invoices
  const isPartiallyPaid = index % 10 === 0; // Every 10th invoice is partially paid
  const isUnpaid = index % 15 === 0; // Every 15th invoice is unpaid by the report creation time
  const payments = isPartiallyPaid
    ? [
        { amount: (paymentAmount / 2).toFixed(2), date: paymentDate },
        {
          amount: (paymentAmount / 2).toFixed(2),
          date: new Date(2024, (index % 12) + 1, (index % 28) + 10)
            .toISOString()
            .split("T")[0],
        },
      ]
    : isUnpaid
      ? [] // No payments made for unpaid invoices
      : [{ amount: paymentAmount, date: paymentDate }];

  return {
    payerEntityName,
    payerEntityABN,
    payerEntityACNARBN,
    payeeEntityName,
    payeeEntityABN,
    payeeEntityACNARBN,
    paymentAmount,
    description,
    supplyDate,
    paymentDate,
    contractPOReferenceNumber,
    contractPOPaymentTerms,
    noticeForPaymentIssueDate,
    noticeForPaymentTerms,
    invoiceReferenceNumber,
    invoiceIssueDate,
    invoiceReceiptDate,
    invoicePaymentTerms,
    invoiceDueDate,
    tradeCreditPayment,
    payments, // Array of payments for the invoice
  };
});

export const mockReceivables = Array.from({ length: 100 }, (_, index) => ({
  receivableTerm: [30, 45, 60, 90][index % 4],
}));
