import { mockInvoices, mockReceivables } from "../data/mockInvoiceData";

export const calculateInvoiceMetrics = (
  reportType,
  isModifiedReport = false
) => {
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
    paymentTerm: invoice.paymentTerm, // Ensure payment term is captured in calendar days
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

  // Prepare the SBTCP Dataset by filtering small business payments
  const sbtcpDataset = tcpDataset.filter((invoice) => {
    // Placeholder for Small Business Identification Tool logic
    const isSmallBusiness = invoice.customerABN; // Replace with actual SBI Tool validation
    return isSmallBusiness && !invoice.isPartialPayment;
  });

  const calculatePaymentTimes = (dataset) => {
    const paymentTimes = dataset
      .map((invoice) => {
        const invoiceDueDate = new Date(invoice.dueDate);
        const paidDate = new Date(invoice.paidDate);

        // Calculate days to pay, ensuring it is not less than 0
        const daysToPay = Math.max(
          Math.round((paidDate - invoiceDueDate) / (1000 * 60 * 60 * 24)),
          0
        );

        return daysToPay;
      })
      .filter((time) => !isNaN(time)); // Exclude invalid or missing payment times

    paymentTimes.sort((a, b) => a - b);

    // Calculate average payment time
    const averagePaymentTime =
      paymentTimes.reduce((sum, time) => sum + time, 0) / paymentTimes.length ||
      0;

    // Calculate median payment time
    const medianPaymentTime =
      paymentTimes.length % 2 === 0
        ? (paymentTimes[paymentTimes.length / 2 - 1] +
            paymentTimes[paymentTimes.length / 2]) /
          2
        : paymentTimes[Math.floor(paymentTimes.length / 2)] || 0;

    // Calculate percentiles
    const percentile = (arr, p) =>
      arr[Math.ceil((p / 100) * arr.length) - 1] || 0;

    const paymentTime80thPercentile = percentile(paymentTimes, 80);
    const paymentTime95thPercentile = percentile(paymentTimes, 95);

    return {
      averagePaymentTime: parseFloat(averagePaymentTime.toFixed(2)), // Ensure two decimal places
      medianPaymentTime: parseFloat(medianPaymentTime.toFixed(2)), // Ensure two decimal places
      paymentTime80thPercentile,
      paymentTime95thPercentile,
    };
  };

  const calculatePercentageWithinTerms = (dataset) => {
    const totalPayments = dataset.length;

    if (totalPayments === 0) {
      return 0; // Avoid division by zero
    }

    const paymentsWithinTerms = dataset.filter((invoice) => {
      const invoiceDueDate = new Date(invoice.dueDate);
      const paidDate = new Date(invoice.paidDate);

      // Calculate days to pay
      const daysToPay = Math.max(
        Math.round((paidDate - invoiceDueDate) / (1000 * 60 * 60 * 24)),
        0
      );

      return invoice.paymentTerm && daysToPay <= invoice.paymentTerm;
    }).length;

    const percentageWithinTerms = (paymentsWithinTerms / totalPayments) * 100;

    return parseFloat(percentageWithinTerms.toFixed(2)); // Round to two decimal places
  };

  const calculatePaymentTimePercentages = (dataset) => {
    const totalPayments = dataset.length;

    if (totalPayments === 0) {
      return {
        within30Days: 0,
        between31And60Days: 0,
        over60Days: 0,
      }; // Avoid division by zero
    }

    const within30DaysCount = dataset.filter((invoice) => {
      const invoiceDueDate = new Date(invoice.dueDate);
      const paidDate = new Date(invoice.paidDate);

      // Calculate days to pay
      const daysToPay = Math.max(
        Math.round((paidDate - invoiceDueDate) / (1000 * 60 * 60 * 24)),
        0
      );

      return daysToPay <= 30;
    }).length;

    const between31And60DaysCount = dataset.filter((invoice) => {
      const invoiceDueDate = new Date(invoice.dueDate);
      const paidDate = new Date(invoice.paidDate);

      // Calculate days to pay
      const daysToPay = Math.max(
        Math.round((paidDate - invoiceDueDate) / (1000 * 60 * 60 * 24)),
        0
      );

      return daysToPay >= 31 && daysToPay <= 60;
    }).length;

    const over60DaysCount = dataset.filter((invoice) => {
      const invoiceDueDate = new Date(invoice.dueDate);
      const paidDate = new Date(invoice.paidDate);

      // Calculate days to pay
      const daysToPay = Math.max(
        Math.round((paidDate - invoiceDueDate) / (1000 * 60 * 60 * 24)),
        0
      );

      return daysToPay > 60;
    }).length;

    return {
      within30Days: parseFloat(
        ((within30DaysCount / totalPayments) * 100).toFixed(2)
      ),
      between31And60Days: parseFloat(
        ((between31And60DaysCount / totalPayments) * 100).toFixed(2)
      ),
      over60Days: parseFloat(
        ((over60DaysCount / totalPayments) * 100).toFixed(2)
      ),
    };
  };

  const calculateSmallBusinessTradeCreditPercentage = (
    sbtcpDataset,
    tcpDataset
  ) => {
    const totalTcpValue = tcpDataset.reduce(
      (sum, invoice) => sum + invoice.invoiceAmount,
      0
    );

    if (totalTcpValue === 0) {
      return 0.01; // Avoid division by zero and ensure minimum value
    }

    const sbtcpValue = sbtcpDataset.reduce(
      (sum, invoice) => sum + invoice.invoiceAmount,
      0
    );

    // Placeholder for partial payments excluded from SBTCP Dataset
    const partialPaymentsValue = tcpDataset
      .filter((invoice) => invoice.isPartialPayment)
      .reduce((sum, invoice) => sum + invoice.invoiceAmount, 0);

    const percentage =
      ((sbtcpValue + partialPaymentsValue) / totalTcpValue) * 100;

    return parseFloat(Math.max(percentage, 0.01).toFixed(2)); // Ensure minimum value of 0.01
  };

  const calculatePeppolEnabledPercentage = (dataset) => {
    const totalPayments = dataset.length;

    if (totalPayments === 0) {
      return 0; // Avoid division by zero
    }

    const peppolEnabledCount = dataset.filter(
      (invoice) => invoice.isPeppolEnabled
    ).length;

    const percentage = (peppolEnabledCount / totalPayments) * 100;

    return parseFloat(percentage.toFixed(2)); // Round to two decimal places
  };

  // Calculate payment times for both datasets
  const tcpPaymentTimes = calculatePaymentTimes(tcpDataset);
  const sbtcpPaymentTimes = calculatePaymentTimes(sbtcpDataset);

  // Calculate percentage of Peppol-enabled payments in the SBTCP Dataset
  const peppolEnabledPercentage =
    calculatePeppolEnabledPercentage(sbtcpDataset);

  // Calculate percentage of small business trade credit payments
  const smallBusinessTradeCreditPercentage =
    calculateSmallBusinessTradeCreditPercentage(sbtcpDataset, tcpDataset);

  // Calculate percentage of payments within terms for the SBTCP Dataset
  const percentageWithinTerms = calculatePercentageWithinTerms(sbtcpDataset);

  // Calculate percentages for payment time ranges in the SBTCP Dataset
  const paymentTimePercentages = calculatePaymentTimePercentages(sbtcpDataset);

  // Extract entity details from the first invoice in the TCP Dataset
  const entityDetails =
    tcpDataset.length > 0
      ? {
          entityName: tcpDataset[0].customerName,
          entityABN: tcpDataset[0].customerABN,
          entityACN: tcpDataset[0].customerACN || null,
          entityARBN: tcpDataset[0].customerARBN || null,
        }
      : {
          entityName: null,
          entityABN: null,
          entityACN: null,
          entityARBN: null,
        };

  // Adjust data preparation based on report type
  if (reportType === "Nil Reporter") {
    return {
      tcpDataset: [],
      sbtcpDataset: [],
      tcpPaymentTimes: null,
      sbtcpPaymentTimes: null,
      paidMetrics: [],
      unpaidMetrics: [],
      reportComments: "", // Optional field for report comments
      declaration: false, // Mandatory checkbox field for declaration
      confirmationStatement: isModifiedReport ? false : undefined, // Mandatory for modified reports
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
    percentageWithinTerms, // Include percentage of payments within terms
    paymentTimePercentages, // Include percentages for payment time ranges
    smallBusinessTradeCreditPercentage, // Include small business trade credit percentage
    peppolEnabledPercentage, // Include percentage of Peppol-enabled payments
    paidMetrics: metrics,
    unpaidMetrics,
    entityValidationResults, // Include validation results for ABN, ACN, and ARBN
    reportComments: "", // Optional field for report comments
    declaration: false, // Mandatory checkbox field for declaration
    confirmationStatement: isModifiedReport ? false : undefined, // Mandatory for modified reports
    entityDetails, // Include entity details in the return object
  };
};
