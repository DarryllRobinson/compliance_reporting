import { fieldMapping } from "../features/reports/ptrs/fieldMapping";

export const stepConfigs = {
  step1: {
    editableFields: ["isTcp", "tcpExclusionComment"],
    hiddenColumns: fieldMapping
      .filter(
        (field) =>
          !field.requiredAtStep?.includes(1) ||
          field.group === "step 2" ||
          field.group === "step 3"
      )
      .map((field) => field.name),
    validationRules: {
      isTcp: "boolean",
      tcpCategory: "string",
      notes: "string",
    },
    getIssueCounts: (records) => ({
      missingAbnCount: records.filter(
        (r) => String(r.payeeEntityAbn ?? "").trim() === ""
      ).length,
      missingNameCount: records.filter(
        (r) =>
          !(typeof r.payeeEntityName === "string" && r.payeeEntityName.trim())
      ).length,
      recommendedExclusionCount: records.filter(
        (r) => r.systemRecommendation === false
      ).length,
    }),
  },

  // future steps like step2, step3...
};
