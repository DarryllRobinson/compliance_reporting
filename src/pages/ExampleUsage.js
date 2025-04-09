import React from "react";
import SectionForm from "./SectionForm";
import { fields as customFields } from "../data/customFields";
import { clients as customClients } from "../data/customClients";

const ExampleUsage = () => {
  return (
    <div>
      <SectionForm fields={customFields} clients={customClients} />
    </div>
  );
};

export default ExampleUsage;
