import { mockInvoices } from "../data/mockInvoiceData";

export const calculateInvoiceMetrics = () => {
  const metrics = [
    {
      label: "Invoices paid within 20 days of receipt",
      number: 0,
      value: 0,
    },
    {
      label: "Invoices paid between 21 and 30 days",
      number: 0,
      value: 0,
    },
    {
      label: "Invoices paid between 31 and 60 days",
      number: 0,
      value: 0,
    },
    {
      label: "Invoices paid between 61 and 90 days",
      number: 0,
      value: 0,
    },
    {
      label: "Invoices paid between 91 and 120 days",
      number: 0,
      value: 0,
    },
    {
      label: "Invoices paid in more than 120 days",
      number: 0,
      value: 0,
    },
  ];

  mockInvoices.forEach((invoice) => {
    if (invoice.paidStatus && invoice.paidDate) {
      const invoiceDate = new Date(invoice.invoiceDate);
      const paidDate = new Date(invoice.paidDate);
      const daysToPay = (paidDate - invoiceDate) / (1000 * 60 * 60 * 24);

      if (daysToPay <= 20) {
        metrics[0].number++;
        metrics[0].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay <= 30) {
        metrics[1].number++;
        metrics[1].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay <= 60) {
        metrics[2].number++;
        metrics[2].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay <= 90) {
        metrics[3].number++;
        metrics[3].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay <= 120) {
        metrics[4].number++;
        metrics[4].value += parseFloat(invoice.invoiceAmount);
      } else {
        metrics[5].number++;
        metrics[5].value += parseFloat(invoice.invoiceAmount);
      }
    }
  });

  return metrics;
};
