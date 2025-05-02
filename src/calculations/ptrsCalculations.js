export const ptrsCalculations = [
  {
    name: "Payment Term",
    conditions: [
      {
        condition: "Contract/PO payment terms",
        paymentTerm:
          "Largest possible number of calendar days (regardless of when the invoice was actually issued or received), if applicable.",
        example:
          "'EOM' would have a Payment Term of 31 days, 'End of Next Month' would have a Payment Term of 62 days, etc.)",
      },
      {
        condition: "Invoice payment terms.",
        paymentTerm: "The largest possible number of calendar days.",
      },
      {
        condition: "Neither of the above apply.",
        paymentTerm:
          "The number of calendar days between the Invoice issue date and the Invoice due date..",
      },
    ],
  },
];
