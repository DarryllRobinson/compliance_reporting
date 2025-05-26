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
    issueRules: [
      {
        id: "missingAbn",
        label: "Missing Payee Entity ABN",
        field: "payeeEntityAbn",
        condition: (record) =>
          !record.payeeEntityAbn || record.payeeEntityAbn === "",
      },
      {
        id: "missingName",
        label: "Missing Payee Entity Name",
        field: "payeeEntityName",
        condition: (record) =>
          !record.payeeEntityName || record.payeeEntityName === "",
      },
    ],
    exclusionRules: [
      {
        field: "description",
        type: "contains",
        terms: ["wage", "salary", "commission"],
      },
    ],
  },

  // future steps like step2, step3...
};
