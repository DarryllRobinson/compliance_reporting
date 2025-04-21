import {
  financeService,
  paymentService,
  submissionService,
} from "../../../services";
import { userService } from "../../users/user.service";

export default async function prepareReport(report, reportContext, reportType) {
  // Clearing existing report details
  clearContext(reportContext);

  let reportDetails = report;

  if (reportType === "continue") {
    try {
      const payment = await paymentService.getByReportId(report.id);
      reportDetails = {
        ...reportDetails,
        reportId: report.id,
        paymentId: payment.id,
      };
    } catch (error) {
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
      console.error("Error retieving finance record", error);
      return false;
    }

    try {
      const submission = await submissionService.getByReportId(report.id);
      reportDetails = {
        ...reportDetails,
        submissionId: submission.id,
      };
    } catch (error) {
      console.error("Error retrieving submission record", error);
      return false;
    }
    //   } else if (reportType === "create") {
    // Create a new report
    report = {
      ...report,
      reportStatus: "Created",
      createdBy: userService.userValue.id,
      clientId: userService.userValue.clientId,
    };

    // Create a record for each section in the database
    try {
      const payment = await paymentService.create({
        reportId: report.id,
        createdBy: userService.userValue.id,
      });
      report.paymentId = payment.id;
    } catch (error) {
      console.error("Error creating payment record:", error);
    }

    try {
      const finance = await financeService.create({
        reportId: report.id,
        createdBy: userService.userValue.id,
      });
      report.financeId = finance.id;
    } catch (error) {
      console.error("Error creating finance record:", error);
    }

    try {
      const submission = await submissionService.create({
        reportId: report.id,
        createdBy: userService.userValue.id,
      });
      report.submissionId = submission.id;
    } catch (error) {
      console.error("Error creating submission record:", error);
    }
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
