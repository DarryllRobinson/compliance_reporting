import { mockInvoices } from "../data/mockInvoiceData";

export const calculateInvoiceMetrics = (reportType) => {
  // Prepare the TCP Dataset
  const tcpDataset = mockInvoices.map((invoice) => ({
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    customerABN: invoice.customerABN,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    invoiceAmount: parseFloat(invoice.invoiceAmount),
    paidStatus: invoice.paidStatus,
    paidDate: invoice.paidDate,
    isPartialPayment:
      invoice.paidStatus && invoice.invoiceAmount > 0 && !invoice.paidDate, // Identify partial payments
  }));

  // Validate ABN, ACN, and ARBN fields
  const validateEntityFields = (entity) => {
    const abnRegex = /^\d{11}$/; // ABN must be 11 digits
    const acnRegex = /^\d{9}$/; // ACN must be 9 digits
    const arbnRegex = /^\d{9}$/; // ARBN must be 9 digits

    return {
      isValidABN: abnRegex.test(entity.customerABN),
      isValidACN: entity.customerACN ? acnRegex.test(entity.customerACN) : true,
      isValidARBN: entity.customerARBN
        ? arbnRegex.test(entity.customerARBN)
        : true,
    };
  };

  // Validate all entities in the TCP Dataset
  const entityValidationResults = tcpDataset.map(validateEntityFields);

  // Prepare the SBTCP Dataset by filtering small business payments and excluding partial payments
  const sbtcpDataset = tcpDataset.filter((invoice) => {
    // Placeholder for Small Business Identification Tool logic
    const isSmallBusiness = invoice.customerABN; // Replace with actual SBI Tool validation
    return isSmallBusiness && !invoice.isPartialPayment;
  });

  const calculatePaymentTimes = (dataset) => {
    const paymentTimes = [];
    dataset.forEach((invoice) => {
      if (invoice.paidStatus && invoice.paidDate) {
        const invoiceDueDate = new Date(invoice.dueDate);
        const paidDate = new Date(invoice.paidDate);
        const daysToPay = Math.round(
          (paidDate - invoiceDueDate) / (1000 * 60 * 60 * 24)
        );
        paymentTimes.push(daysToPay);
      }
    });

    paymentTimes.sort((a, b) => a - b);

    const averagePaymentTime =
      paymentTimes.reduce((sum, time) => sum + time, 0) / paymentTimes.length ||
      0;

    const medianPaymentTime =
      paymentTimes.length % 2 === 0
        ? (paymentTimes[paymentTimes.length / 2 - 1] +
            paymentTimes[paymentTimes.length / 2]) /
          2
        : paymentTimes[Math.floor(paymentTimes.length / 2)] || 0;

    const percentile = (arr, p) =>
      arr[Math.ceil((p / 100) * arr.length) - 1] || 0;

    const paymentTime80thPercentile = percentile(paymentTimes, 80);
    const paymentTime95thPercentile = percentile(paymentTimes, 95);

    return {
      averagePaymentTime,
      medianPaymentTime,
      paymentTime80thPercentile,
      paymentTime95thPercentile,
    };
  };

  // Calculate payment times for both datasets
  const tcpPaymentTimes = calculatePaymentTimes(tcpDataset);
  const sbtcpPaymentTimes = calculatePaymentTimes(sbtcpDataset);

  // Adjust data preparation based on report type
  if (reportType === "Nil Reporter") {
    return {
      tcpDataset: [],
      sbtcpDataset: [],
      tcpPaymentTimes: null,
      sbtcpPaymentTimes: null,
      paidMetrics: [],
      unpaidMetrics: [],
    };
  }

  if (reportType === "External Administration") {
    // Placeholder logic for filtering based on external administration dates
  }

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

  sbtcpDataset.forEach((invoice) => {
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

  return {
    tcpDataset,
    sbtcpDataset,
    tcpPaymentTimes,
    sbtcpPaymentTimes,
    paidMetrics: metrics,
    unpaidMetrics,
    entityValidationResults, // Include validation results for ABN, ACN, and ARBN
  };
};
