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

  const unpaidMetrics = [
    {
      label: "Unpaid invoices overdue by up to 20 days",
      number: 0,
      value: 0,
    },
    {
      label: "Unpaid invoices overdue by 21 to 30 days",
      number: 0,
      value: 0,
    },
    {
      label: "Unpaid invoices overdue by 31 to 60 days",
      number: 0,
      value: 0,
    },
    {
      label: "Unpaid invoices overdue by 61 to 90 days",
      number: 0,
      value: 0,
    },
    {
      label: "Unpaid invoices overdue by 91 to 120 days",
      number: 0,
      value: 0,
    },
    {
      label: "Unpaid invoices overdue by more than 120 days",
      number: 0,
      value: 0,
    },
  ];

  mockInvoices.forEach((invoice) => {
    if (invoice.paidStatus && invoice.paidDate) {
      const invoiceDueDate = new Date(invoice.dueDate);
      const paidDate = new Date(invoice.paidDate);
      const daysToPay = Math.round(
        (paidDate - invoiceDueDate) / (1000 * 60 * 60 * 24)
      );

      if (daysToPay >= 0 && daysToPay <= 20) {
        metrics[0].number++;
        metrics[0].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay >= 21 && daysToPay <= 30) {
        metrics[1].number++;
        metrics[1].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay >= 31 && daysToPay <= 60) {
        metrics[2].number++;
        metrics[2].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay >= 61 && daysToPay <= 90) {
        metrics[3].number++;
        metrics[3].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay >= 91 && daysToPay <= 120) {
        metrics[4].number++;
        metrics[4].value += parseFloat(invoice.invoiceAmount);
      } else if (daysToPay > 120) {
        metrics[5].number++;
        metrics[5].value += parseFloat(invoice.invoiceAmount);
      }
    } else if (!invoice.paidStatus) {
      const invoiceDueDate = new Date(invoice.dueDate);
      const today = new Date();
      const overdueDays = Math.round(
        (today - invoiceDueDate) / (1000 * 60 * 60 * 24)
      );

      if (overdueDays >= 0 && overdueDays <= 20) {
        unpaidMetrics[0].number++;
        unpaidMetrics[0].value += parseFloat(invoice.invoiceAmount);
      } else if (overdueDays >= 21 && overdueDays <= 30) {
        unpaidMetrics[1].number++;
        unpaidMetrics[1].value += parseFloat(invoice.invoiceAmount);
      } else if (overdueDays >= 31 && overdueDays <= 60) {
        unpaidMetrics[2].number++;
        unpaidMetrics[2].value += parseFloat(invoice.invoiceAmount);
      } else if (overdueDays >= 61 && overdueDays <= 90) {
        unpaidMetrics[3].number++;
        unpaidMetrics[3].value += parseFloat(invoice.invoiceAmount);
      } else if (overdueDays >= 91 && overdueDays <= 120) {
        unpaidMetrics[4].number++;
        unpaidMetrics[4].value += parseFloat(invoice.invoiceAmount);
      } else if (overdueDays > 120) {
        unpaidMetrics[5].number++;
        unpaidMetrics[5].value += parseFloat(invoice.invoiceAmount);
      }
    }
  });

  return { paidMetrics: metrics, unpaidMetrics };
};
