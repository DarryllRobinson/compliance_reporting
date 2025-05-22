import {
  financeService,
  paymentService,
  submissionService,
} from "../../../services";
import { useAlert } from "../../../context";

export default async function prepareReport(report, reportContext) {
  // Clearing existing report details
  clearContext(reportContext);

  let reportDetails = report;

  // if (reportType === "continue") {
  try {
    const payment = await paymentService.getByReportId(report.id);
    reportDetails = {
      ...reportDetails,
      reportId: report.id,
      paymentId: payment.id,
    };
  } catch (error) {
    useAlert.sendAlert("error", error || "Payment not found");
    console.error("Error retrieving payment record", error);
    return false;
  }

  try {
    const finance = await financeService.getByReportId(report.id);
    reportDetails = {
      ...reportDetails,
      financeId: finance.id,
    };
  } catch (error) {
    useAlert.sendAlert("error", error || "Finance not found");
    console.error("Error retrieving finance record", error);
    return false;
  }

  try {
    const submission = await submissionService.getByReportId(report.id);
    reportDetails = {
      ...reportDetails,
      submissionId: submission.id,
    };
  } catch (error) {
    useAlert.sendAlert("error", error || "Submission not found");
    console.error("Error retrieving submission record", error);
    return false;
  }

  if (reportContext && reportContext.setReportDetails) {
    reportContext.setReportDetails(reportDetails);
  }
  return true;
}

function clearContext(reportContext) {
  if (reportContext && reportContext.setReportDetails) {
    reportContext.setReportDetails(null);
  }
}
