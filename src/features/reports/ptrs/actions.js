export async function createReportAction({ request, context }) {
  const { alertContext, reportContext } = context;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const today = new Date();
  const minStartDate = new Date("2024-07-01");
  const errors = {};

  // Validation logic
  if (!data.ReportingPeriodStartDate) {
    errors.ReportingPeriodStartDate = "Start date is required.";
  } else if (new Date(data.ReportingPeriodStartDate) < minStartDate) {
    errors.ReportingPeriodStartDate =
      "Start date cannot be before 1 July 2024.";
  }

  if (!data.ReportingPeriodEndDate) {
    errors.ReportingPeriodEndDate = "End date is required.";
  } else if (new Date(data.ReportingPeriodEndDate) >= today) {
    errors.ReportingPeriodEndDate =
      "End date cannot be the same as or later than the date of submission.";
  } else if (
    new Date(data.ReportingPeriodStartDate) >=
    new Date(data.ReportingPeriodEndDate)
  ) {
    errors.ReportingPeriodEndDate = "End date must be after the start date.";
  }

  if (
    new Date(data.ReportingPeriodEndDate) -
      new Date(data.ReportingPeriodStartDate) >
    365 * 24 * 60 * 60 * 1000
  ) {
    errors.ReportingPeriodEndDate = "Reporting period cannot exceed 12 months.";
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Persist report metadata (example)
  const reportMetadata = {
    ReportingPeriodStartDate: data.ReportingPeriodStartDate,
    ReportingPeriodEndDate: data.ReportingPeriodEndDate,
    ApprovalDate: data.ApprovalDate,
  };

  if (reportContext && reportContext.addReport) {
    reportContext.addReport(reportMetadata);
  }

  alertContext.sendAlert("success", "Report created successfully!");
  return null; // No errors, form submission successful
}
