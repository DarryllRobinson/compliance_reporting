import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  TextField,
  useTheme,
  TablePagination,
} from "@mui/material";
import { mockInvoices } from "../../../data/mockInvoiceData";

export default function UpdatePtrs() {
  const theme = useTheme();
  const [invoices, setInvoices] = useState(mockInvoices);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectInvoice = (invoiceNumber) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceNumber)
        ? prev.filter((num) => num !== invoiceNumber)
        : [...prev, invoiceNumber]
    );
  };

  const handleBulkEdit = () => {
    const updatedInvoices = invoices.map((invoice) =>
      selectedInvoices.includes(invoice.invoiceReferenceNumber)
        ? { ...invoice, invoicePaymentTerms: 60 } // Example: Set payment term to 60 for selected invoices
        : invoice
    );
    setInvoices(updatedInvoices);
    setSelectedInvoices([]); // Clear selection after bulk edit
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 1200,
          width: "100%",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <h2>Review and Confirm Invoices</h2>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Payer Name</TableCell>
                <TableCell>Payer ABN</TableCell>
                <TableCell>Payer ACN/ARBN</TableCell>
                <TableCell>Payee Name</TableCell>
                <TableCell>Payee ABN</TableCell>
                <TableCell>Payee ACN/ARBN</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Supply Date</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Contract/PO Ref</TableCell>
                <TableCell>Contract/PO Terms</TableCell>
                <TableCell>Notice Issue Date</TableCell>
                <TableCell>Notice Terms</TableCell>
                <TableCell>Invoice Issue Date</TableCell>
                <TableCell>Invoice Receipt Date</TableCell>
                <TableCell>Invoice Payment Terms</TableCell>
                <TableCell>Invoice Due Date</TableCell>
                <TableCell>Trade Credit Payment</TableCell>
                <TableCell>Exclude</TableCell>
                <TableCell>Exclusion Comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice, index) => (
                  <TableRow key={`${invoice.invoiceReferenceNumber}-${index}`}>
                    <TableCell>
                      <Checkbox
                        checked={selectedInvoices.includes(
                          invoice.invoiceReferenceNumber
                        )}
                        onChange={() =>
                          handleSelectInvoice(invoice.invoiceReferenceNumber)
                        }
                      />
                    </TableCell>
                    <TableCell>{invoice.invoiceReferenceNumber}</TableCell>
                    <TableCell>{invoice.payerEntityName}</TableCell>
                    <TableCell>{invoice.payerEntityABN}</TableCell>
                    <TableCell>{invoice.payerEntityACNARBN}</TableCell>
                    <TableCell>{invoice.payeeEntityName}</TableCell>
                    <TableCell>{invoice.payeeEntityABN}</TableCell>
                    <TableCell>{invoice.payeeEntityACNARBN}</TableCell>
                    <TableCell>${invoice.paymentAmount}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{invoice.supplyDate}</TableCell>
                    <TableCell>{invoice.paymentDate || "Not Paid"}</TableCell>
                    <TableCell>{invoice.contractPOReferenceNumber}</TableCell>
                    <TableCell>{invoice.contractPOPaymentTerms}</TableCell>
                    <TableCell>{invoice.noticeForPaymentIssueDate}</TableCell>
                    <TableCell>{invoice.noticeForPaymentTerms}</TableCell>
                    <TableCell>{invoice.invoiceIssueDate}</TableCell>
                    <TableCell>{invoice.invoiceReceiptDate}</TableCell>
                    <TableCell>{invoice.invoicePaymentTerms}</TableCell>
                    <TableCell>{invoice.invoiceDueDate}</TableCell>
                    <TableCell>
                      {invoice.tradeCreditPayment ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={invoice.excludeFromCalculations || false}
                        onChange={(e) => {
                          const updatedInvoices = invoices.map((inv) =>
                            inv.invoiceReferenceNumber ===
                            invoice.invoiceReferenceNumber
                              ? {
                                  ...inv,
                                  excludeFromCalculations: e.target.checked,
                                }
                              : inv
                          );
                          setInvoices(updatedInvoices);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        placeholder="Reason for exclusion"
                        value={invoice.exclusionComment || ""}
                        onChange={(e) => {
                          const updatedInvoices = invoices.map((inv) =>
                            inv.invoiceReferenceNumber ===
                            invoice.invoiceReferenceNumber
                              ? {
                                  ...inv,
                                  exclusionComment: e.target.value,
                                }
                              : inv
                          );
                          setInvoices(updatedInvoices);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={invoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleBulkEdit}
            disabled={selectedInvoices.length === 0}
          >
            Bulk Edit Payment Terms
          </Button>
          <Button variant="contained" color="secondary">
            Confirm and Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
