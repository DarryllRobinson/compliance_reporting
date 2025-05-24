import { Typography } from "@mui/material";
import CollapsibleTable from "./CollapsibleTable";
import { stepConfigs } from "../../../config/stepConfigs";
import { useReportContext } from "../../../context";

export default function Step1() {
  const { records } = useReportContext();

  if (!records) {
    return <Typography variant="body1">No records available.</Typography>;
  }

  const stepConfig = stepConfigs.step1;

  const { missingAbnCount, missingNameCount, recommendedExclusionCount } =
    records?.length
      ? stepConfig.getIssueCounts(records)
      : {
          missingAbnCount: 0,
          missingNameCount: 0,
          recommendedExclusionCount: 0,
        };

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>
        🟡 <strong>{records.length}</strong> record(s) loaded for review.
      </Typography>
      <Typography variant="body1">
        {missingAbnCount > 0 ? "⚠️" : "✅"} <strong>{missingAbnCount}</strong>{" "}
        record(s) missing Payee ABN
      </Typography>
      <Typography variant="body1">
        {missingNameCount > 0 ? "⚠️" : "✅"} <strong>{missingNameCount}</strong>{" "}
        record(s) missing Payee Name
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        🧠 <strong>{recommendedExclusionCount}</strong> record(s) are
        recommended by the system to be excluded from TCP.
      </Typography>

      <CollapsibleTable
        editableFields={stepConfig.editableFields}
        hiddenColumns={stepConfig.hiddenColumns}
      />
    </>
  );
}
