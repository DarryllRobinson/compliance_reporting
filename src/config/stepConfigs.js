export const stepConfigs = {
  step1: {
    editableFields: ["isTcp", "tcpCategory", "notes"],
    hiddenColumns: ["createdAt", "updatedAt", "systemRecommendation"],
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
