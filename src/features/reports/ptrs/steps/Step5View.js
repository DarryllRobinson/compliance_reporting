import React from "react";
import Step5 from "../Step5";

export default function Step5View({ data, onNext, onBack }) {
  return <Step5 savedRecords={data} onNext={onNext} onBack={onBack} />;
}
