import { faker } from "@faker-js/faker";

export const generateMockInvoices = () => {
  const invoices = [];
  const today = new Date();

  for (let i = 0; i < 100; i++) {
    const invoiceDate = faker.date.between({
      from: new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000),
      to: today,
    });
    const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const isPaid = faker.datatype.boolean();
    const paidDate = isPaid
      ? faker.date.between({ from: invoiceDate, to: dueDate })
      : null;

    invoices.push({
      invoiceNumber: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
      customerName: faker.company.name(),
      customerABN: faker.number.int({ min: 1000000 }),
      invoiceDate: invoiceDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      invoiceAmount: faker.finance.amount(100, 10000, 2),
      paidStatus: isPaid,
      paidDate: paidDate ? paidDate.toISOString().split("T")[0] : null,
    });
  }

  return invoices;
};

const mockInvoices = generateMockInvoices();
console.log(JSON.stringify(mockInvoices, null, 2));
