export const fields = [
  { name: "BusinessName", label: "Reporting entity's name", confirmed: false },
  { name: "ABN", label: "Reporting entity's ABN", confirmed: false },
  { name: "ACN", label: "Reporting entity's ACN", confirmed: false },
  {
    name: "ControllingCorporationName",
    label:
      "If applicable, the name of the reporting entity's controlling corporation",
    confirmed: false,
  },
  {
    name: "ControllingCorporationABN",
    label: "If applicable, the ABN of the controlling corporation",
    confirmed: false,
  },
  {
    name: "ControllingCorporationACN",
    label: "If applicable, the ACN of the controlling corporation",
    confirmed: false,
  },
  {
    name: "HeadEntityName",
    label: "If applicable, the name of the reporting entity's head entity",
    confirmed: false,
  },
  {
    name: "HeadEntityABN",
    label: "If applicable, the ABN of the head entity",
    confirmed: false,
  },
  {
    name: "HeadEntityACN",
    label: "If applicable, the ACN of the head entity",
    confirmed: false,
  },
  {
    name: "BusinessIndustryCode",
    label:
      "The reporting entity's primary industry as based on the ATO's Business Industry Codes (BIC)",
    confirmed: false,
  },
  {
    name: "ReportingPeriodStartDate",
    label: "The starting date of the period covered in this report",
    confirmed: false,
  },
  {
    name: "ReportingPeriodEndDate",
    label: "The end date of the period covered in this report",
    confirmed: false,
  },
  {
    name: "StandardPaymentPeriodInCalendarDays",
    label:
      "The reporting entity's standard payment supply period at the start of the 6 month reporting period, outlining the time in which payments are required to be paid to small business suppliers, disregarding any supply chain finance arrangements",
    confirmed: false,
  },
  {
    name: "ChangesToStandardPaymentPeriod",
    label:
      "Changes to the standard payment period for the reporting entity over the 6 months of the reporting period in calendar days.",
    confirmed: false,
  },
  {
    name: "DetailsOfChangesToStandardPaymentPeriod",
    label:
      "Explanation of any changes to the standard payment periods for the reporting entity over the 6 month reporting period",
    confirmed: false,
  },
  {
    name: "ShortestActualStandardPaymentPeriod",
    label:
      "The shortest standard payment periods for the reporting entity at the start of the 6 month reporting period in calendar days",
    confirmed: false,
  },
  {
    name: "ChangeShortestActualPaymentPeriod",
    label:
      "Changes to the shortest standard payment periods for the entity over the 6 month reporting period in calendar days.",
    confirmed: false,
  },
  {
    name: "DetailChangeShortestActualPaymentPeriod",
    label:
      "Explanation of any changes to the shortest standard payment periods for the entity during the 6 month reporting period",
    confirmed: false,
  },
  {
    name: "LongestActualStandardPaymentPeriod",
    label:
      "The longest standard payment periods for the entity at the start of the 6 month reporting period in calendar days",
    confirmed: false,
  },
  {
    name: "ChangeLongestActualPaymentPeriod",
    label:
      "Changes to the longest standard payment periods for the entity over the 6 month reporting period in calendar days.",
    confirmed: false,
  },
  {
    name: "DetailChangeLongestActualPaymentPeriod",
    label:
      "Explanation of any changes to the longest standard payment periods for the entity during the 6 month reporting period",
    confirmed: false,
  },
  {
    name: "NumberInvoicesPaidWithin20DaysOfReceipt",
    label:
      "The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period within 20 calendar days after the day of receipt day",
    confirmed: false,
  },
  {
    name: "NumberInvoicesPaidBetween21And30Days",
    label:
      "The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period between 21 and 30 calendar days after the day of receipt",
    confirmed: false,
  },
  {
    name: "NumberInvoicesPaidBetween31And60Days",
    label:
      "The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period between 31 and 60 calendar days after the day of receipt",
    confirmed: false,
  },
  {
    name: "NumberInvoicesPaidBetween61And90Days",
    label:
      "The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period between 61 and 90 calendar days after the  day of receipt",
    confirmed: false,
  },
  {
    name: "NumberInvoicesPaidBetween91And120Days",
    label:
      "The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period between 91 and 120 calendar days after the day of receipt",
    confirmed: false,
  },
  {
    name: "NumberInvoicesPaidInMoreThan120Days",
    label:
      "The proportion, determined by total number, of small business invoices paid by the reporting entity during the reporting period more than 120 calendar days after the day of receipt.",
    confirmed: false,
  },
  {
    name: "ValueInvoicesPaidWithin20Days",
    label:
      "The proportion, determined by total value, of small business invoices paid by the reporting entity during the reporting period within 20 calendar days after the day of receipt",
    confirmed: false,
  },
  {
    name: "ValueInvoicesPaidBetween21And30Days",
    label:
      "The proportion, determined by total value, of small business invoices paid by the reporting entity during the reporting period between 21 and 30 calendar days after the day of receipt",
    confirmed: false,
  },
  {
    name: "ValueInvoicesPaidBetween31And60Days",
    label:
      "The proportion, determined by total value, of small business invoices paid by the reporting entity during the reporting period between 31 and 60 calendar days after the day of receipt",
    confirmed: false,
  },
  {
    name: "ValueInvoicesPaidBetween61And90Days",
    label:
      "The proportion, determined by total value, of small business invoices paid by the reporting entity during the reporting period between 61 and 90 calendar days after the  day of receipt",
    confirmed: false,
  },
  {
    name: "ValueInvoicesPaidBetween91And120Days",
    label:
      "The proportion, determined by total value, of small business invoices paid by the reporting entity during the reporting period between 91 and 120 calendar days after the day of receipt",
    confirmed: false,
  },
  {
    name: "ValueInvoicesPaidInMoreThan120Days",
    label:
      "The proportion, determined by total value, of small business invoices paid by the reporting entity during the reporting period more than 120 calendar days after the day of receipt.",
    confirmed: false,
  },
  {
    name: "InvoicePracticesAndArrangements",
    label:
      "Details of any practices or arrangements used by the reporting entity during the reporting period for the receiving or paying of small business invoices",
    confirmed: false,
  },
  {
    name: "PracticesAndArrangementsForLodgingTender",
    label:
      "Details of any practices or arrangements used by entity during the reporting period requiring small business suppliers to pay an amount, including a subscription or membership fee to participate in the entity's procurement processes for lodging a tender",
    confirmed: false,
  },
  {
    name: "PracticesAndArrangementsToAcceptInvoice",
    label:
      "Details of any practices or arrangements used by entity during the reporting period requiring small business suppliers to pay an amount, including a subscription or membership fee for the entity to accept an invoice issued by the small business supplier",
    confirmed: false,
  },
  {
    name: "TotalValueOfSmallBusinessProcurement",
    label:
      "The proportion, determined by total value, of all procurement by the reporting entity during the reporting period that was from small business suppliers",
    confirmed: false,
  },
  {
    name: "SupplyChainFinanceArrangements",
    label:
      "A description of any supply chain finance arrangements that are provided or used for small business suppliers",
    confirmed: false,
  },
  {
    name: "TotalNumberSupplyChainFinanceArrangement",
    label:
      "The proportion, determined by total number, of small business invoices where supply chain finance arrangements were used",
    confirmed: false,
  },
  {
    name: "TotalValueSupplyChainFinanceArrangements",
    label:
      "The proportion, determined by total value, of small business invoices where supply chain finance arrangements were used",
    confirmed: false,
  },
  {
    name: "BenefitsOfSupplyChainFinanceArrangements",
    label:
      "Details of any benefits, including commissions or other payments, received by the reporting entity from the provider of any supply chain finance arrangements",
    confirmed: false,
  },
  {
    name: "RequirementToUseSupplyChainFinance",
    label:
      "Statement on whether small business suppliers were required to agree to use supply chain finance arrangements to participate in the reporting entity's procurement process or to receive payments for invoices during the reporting period",
    confirmed: false,
  },
  {
    name: "DetailOfChangeInAccountingPeriod",
    label:
      "Information about any changes to accounting periods that occurred during the reporting period",
    confirmed: false,
  },
  {
    name: "DetailOfChangeInBusinessName",
    label:
      "Information about any changes to business name that occurred during the reporting period",
    confirmed: false,
  },
  {
    name: "DetailEntitesBelowReportingThreshold",
    label:
      "Information about any changes to any member entities whose income was below $10 million in the two most recent income years",
    confirmed: false,
  },
  {
    name: "ReportComments",
    label:
      "Any written information to provide context or explanation in relation to the information provided in the report",
    confirmed: false,
  },
  {
    name: "SubmitterFirstName",
    label: "First name of the person submitting the report",
    confirmed: false,
  },
  {
    name: "SubmitterLastName",
    label: "Last name of the person submitting the report",
    confirmed: false,
  },
  {
    name: "SubmitterPosition",
    label: "Position of the person submitting the report",
    confirmed: false,
  },
  {
    name: "SubmitterPhoneNumber",
    label: "Phone number of the person submitting the report",
    confirmed: false,
  },
  {
    name: "SubmitterEmail",
    label: "Email of the person submitting the report",
    confirmed: false,
  },
  {
    name: "ApproverFirstName",
    label:
      "First name of the responsible member of the Reporting Entity or if relevant, the controlling corporation, who approved the report",
    confirmed: false,
  },
  {
    name: "ApproverLastName",
    label:
      "Last name of the responsible member of the Reporting Entity or if relevant, the controlling corporation, who approved the report",
    confirmed: false,
  },
  {
    name: "ApproverPosition",
    label:
      "Position of the responsible member of the Reporting Entity or if relevant, the controlling corporation, who approved the report",
    confirmed: false,
  },
  {
    name: "ApproverPhoneNumber",
    label:
      "Phone number of the responsible member of the Reporting Entity or if relevant, the controlling corporation, who approved the report",
    confirmed: false,
  },
  {
    name: "ApproverEmail",
    label:
      "Email of the responsible member of the Reporting Entity or if relevant, the controlling corporation, who approved the report",
    confirmed: false,
  },
  {
    name: "ApprovalDate",
    label:
      "Date the report was approved by responsible member of the reporting entity or if relevant, the controlling corporation",
    confirmed: false,
  },
  {
    name: "PrincipalGoverningBodyName",
    label: "Name of the principal governing body of the reporting entity.",
    confirmed: false,
  },
  {
    name: "PrincipalGoverningBodyDescription",
    label:
      "Description of the principal governing body of the reporting entity.",
    confirmed: false,
  },
  {
    name: "ResponsibleMemberDeclaration",
    label: "Declaration of the responsible member.",
    confirmed: false,
  },
];
