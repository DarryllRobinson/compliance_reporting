import { mockInvoices } from "../data/mockInvoiceData";

export const calculateInvoiceMetrics = () => {
  const metrics = {
    NumberInvoicesPaidWithin20DaysOfReceipt: 0,
    NumberInvoicesPaidBetween21And30Days: 0,
    NumberInvoicesPaidBetween31And60Days: 0,
    NumberInvoicesPaidBetween61And90Days: 0,
    NumberInvoicesPaidBetween91And120Days: 0,
    NumberInvoicesPaidInMoreThan120Days: 0,
    ValueInvoicesPaidWithin20Days: 0,
    ValueInvoicesPaidBetween21And30Days: 0,
    ValueInvoicesPaidBetween31And60Days: 0,
    ValueInvoicesPaidBetween61And90Days: 0,
    ValueInvoicesPaidBetween91And120Days: 0,
    ValueInvoicesPaidInMoreThan120Days: 0,
  };

  mockInvoices.forEach((invoice) => {
    if (invoice.paidStatus && invoice.paidDate) {
      const invoiceDate = new Date(invoice.invoiceDate);
      const paidDate = new Date(invoice.paidDate);
      const daysToPay = (paidDate - invoiceDate) / (1000 * 60 * 60 * 24);

      if (daysToPay <= 20) {
        metrics.NumberInvoicesPaidWithin20DaysOfReceipt++;
        metrics.ValueInvoicesPaidWithin20Days += parseFloat(
          invoice.invoiceAmount
        );
      } else if (daysToPay <= 30) {
        metrics.NumberInvoicesPaidBetween21And30Days++;
        metrics.ValueInvoicesPaidBetween21And30Days += parseFloat(
          invoice.invoiceAmount
        );
      } else if (daysToPay <= 60) {
        metrics.NumberInvoicesPaidBetween31And60Days++;
        metrics.ValueInvoicesPaidBetween31And60Days += parseFloat(
          invoice.invoiceAmount
        );
      } else if (daysToPay <= 90) {
        metrics.NumberInvoicesPaidBetween61And90Days++;
        metrics.ValueInvoicesPaidBetween61And90Days += parseFloat(
          invoice.invoiceAmount
        );
      } else if (daysToPay <= 120) {
        metrics.NumberInvoicesPaidBetween91And120Days++;
        metrics.ValueInvoicesPaidBetween91And120Days += parseFloat(
          invoice.invoiceAmount
        );
      } else {
        metrics.NumberInvoicesPaidInMoreThan120Days++;
        metrics.ValueInvoicesPaidInMoreThan120Days += parseFloat(
          invoice.invoiceAmount
        );
      }
    }
  });

  return metrics;
};
