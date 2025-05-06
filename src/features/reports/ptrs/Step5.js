import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useLoaderData } from "react-router";
import { calculateStep5Metrics } from "../../../calculations/ptrs";
import { tcpService } from "../../../services";
import { CheckBox } from "@mui/icons-material";

export async function step5Loader({ params }) {
  const { reportId } = params;

  try {
    // Fetch the dataset for Step5
    // Fetch TCP dataset for Step4
    const dataset = await tcpService.getTcpByReportId(reportId);

    // Calculate metrics
    const metrics = calculateStep5Metrics(dataset);

    return { dataset, metrics };
  } catch (error) {
    console.error("Error fetching dataset for Step5:", error);
    throw new Response("Failed to fetch dataset for Step5", { status: 500 });
  }
}

const sections = [
  {
    title: "Declaration & Entity Details",
    fields: [
      {
        label:
          "I confirm the information in the Entity Information form is still true and correct.",
        value: "Checkbox",
        comment:
          "All reporting entities must ensure their entity information (provided to the Regulator in the Entity Information form) is accurate at the time of submitting a payment times report. Entity information can be updated via the Portal.",
      },
      {
        label: "Entity ABN",
        value: "99 999 999 999",
        comment:
          "Fields will be pre-populated based on entity's profile on the Portal.",
      },
      {
        label: "Entity ACN",
        value: "999 999 999",
        comment:
          "Fields will be pre-populated based on entity's profile on the Portal.",
      },
      {
        label: "Entity ARBN",
        value: "",
        comment:
          "Fields will be pre-populated based on entity's profile on the Portal.",
      },
    ],
  },
  {
    title: "Report Details",
    fields: [
      {
        label: "Report Period Start Date",
        value: "tbc",
        comment:
          "The start date of the reporting period for which the report is being submitted.",
      },
      {
        label: "Report Period End Date",
        value: "tbc",
        comment:
          "The end date of the reporting period for which the report is being submitted.",
      },
      {
        label: "Approving responsible member given name",
        value: "Homer",
        comment: "The first name of the person approving the report.",
      },
      {
        label: "Approving responsible member family name",
        value: "Simpson",
        comment: "The last name of the person approving the report.",
      },
      {
        label: "Responsible member approval date",
        value: "15/06/3035",
        comment: "The date when the report was approved.",
      },
    ],
  },
  {
    title: "Payment Practices",
    fields: [
      {
        label:
          "Did the entity offer supply chain finance arrangements during the reporting period?",
        value: "tbc",
        comment:
          "As outlined in the 'Suppliers & Internal Policies' tab, all entities in the WE Group offer reverse factoring arrangements to all their suppliers, and also accept settlement discounts. Accordingly, the selected answer to this question is 'Yes' and further details must be provided in the 'Report Comments' field later in the report.",
      },
      {
        label: "Did the entity charge fees as part of the procurement process?",
        value: "tbc",
        comment:
          "For this Worked Example, no entities in the WE Group charged fees as part of the procurement process. Accordingly, the selected answer is 'No'.",
      },
      {
        label:
          "Do any Australian laws, voluntary codes or agreements impose requirements on the entity's payment times and practices to small businesses?",
        value: "tbc",
        comment:
          "For this Worked Example, the WE Group entities' payment times and practices to small business are not subject to any Australian laws or codes of conduct. Accordingly, the selected answer is 'No'.",
      },
    ],
  },
  {
    title: "Payment Terms",
    fields: [
      {
        label: "Most common payment term (statistical mode)",
        value: "30",
        comment:
          "This is the payment term that appears most frequently in the 'Payment Term' column in the Final SBTCP Dataset, calculated using the MODE() function.",
      },
      {
        label: "Receivable terms compared to most common payment term",
        value: "Longer",
        comment:
          "All entities have a policy of issuing 45-day invoices. As 45 > 30, the correct value is 'Longer'.",
      },
      {
        label: "Range of most common payment terms - minimum",
        value: "14",
        comment:
          "Calculated by applying MODE() for each payer, then MIN() across those values. E.g., NZSubCo: 14 days.",
      },
      {
        label: "Range of most common payment terms - maximum",
        value: "31",
        comment:
          "Calculated by applying MODE() for each payer, then MAX() across those values. E.g., AusSubCo2: 31 days.",
      },
      {
        label: "Expected most common payment term for next period (estimate)",
        value: "30",
        comment: "No change planned, so previous value is reused.",
      },
      {
        label:
          "Expected range of most common payment terms for next period - minimum (estimate)",
        value: "14",
        comment:
          "Based on current policies remaining unchanged, previous minimum is reused.",
      },
      {
        label:
          "Expected range of most common payment terms for next period - maximum (estimate)",
        value: "31",
        comment:
          "Based on current policies remaining unchanged, previous maximum is reused.",
      },
    ],
  },
  {
    title: "Payment Times",
    fields: [
      {
        label: "Average payment time",
        value: "28.95",
        comment:
          "Calculated using AVERAGE() on all values in the 'Payment Time' column of the Final SBTCP Dataset.",
      },
      {
        label: "Median payment time",
        value: "26.00",
        comment:
          "Calculated using MEDIAN() on all values in the 'Payment Time' column.",
      },
      {
        label: "80th percentile payment time",
        value: "44",
        comment:
          "Calculated using PERCENTILE.INC() on the 'Payment Time' column with 0.8 input; result must be a real data point.",
      },
      {
        label: "95th percentile payment time",
        value: "59",
        comment:
          "Calculated using PERCENTILE.INC() on the 'Payment Time' column with 0.95 input; interpolation not permitted.",
      },
      {
        label:
          "Percentage of small business trade credit arrangements paid within payment terms",
        value: "62.90",
        comment:
          "Payments where Payment Time ≤ Payment Term ÷ Total Payments × 100.",
      },
      {
        label: "Invoices paid within 30 days (%)",
        value: "64.52",
        comment: "Payments where Payment Time ≤ 30 ÷ Total Payments × 100.",
      },
      {
        label: "Invoices paid in 31-60 days (%)",
        value: "30.65",
        comment:
          "Payments where Payment Time is between 31 and 60 ÷ Total Payments × 100.",
      },
      {
        label: "Invoices paid over 60 days (%)",
        value: "4.84",
        comment: "Payments where Payment Time > 60 ÷ Total Payments × 100.",
      },
    ],
  },
  {
    title: "Miscellaneous",
    fields: [
      {
        label:
          "Small business trade credit payments as a percentage of total trade credit payments",
        value: "89.74",
        comment:
          "Total small business trade credit payments ÷ Total trade credit payments × 100. Calculated using payment amounts from Steps 5 & 6 SBTCP and Final TCP datasets.",
      },
      {
        label: "Percentage of Peppol enabled small business procurement",
        value: "74.19",
        comment:
          "Payments marked 'Yes' in the 'Peppol invoice enabled' column ÷ Total SBTCP payments × 100. Only certain entities were set up for Peppol.",
      },
      {
        label: "Report comments",
        value:
          "Reverse factoring arrangements are offered to all suppliers but usually make up a small portion of supply chain financing.\n\nDuring the reporting period, all supply chain financing arrangements related to settlement discounts.",
        comment:
          "Entities must provide additional details about material changes, controlled exclusions, or other important clarifications when Supply Chain Finance is reported.",
      },
    ],
  },
];

export default function Step5() {
  const { dataset, metrics } = useLoaderData();

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Step 5: Final Report Summary
      </Typography>
      {sections.map((section, sectionIndex) => (
        <TableContainer
          component={Paper}
          sx={{ marginBottom: 3 }}
          key={sectionIndex}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="h6">{section.title}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {section.fields.map((field, fieldIndex) => (
                <TableRow key={fieldIndex}>
                  <TableCell>{field.label}</TableCell>
                  <TableCell>
                    {field.value === "Checkbox" ? (
                      <CheckBox checked={true} disabled />
                    ) : (
                      <TextField
                        variant="outlined"
                        size="small"
                        value={field.value}
                        disabled
                      />
                    )}
                  </TableCell>
                  <TableCell>{field.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
}
