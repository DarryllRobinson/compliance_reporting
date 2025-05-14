import React from "react";
import Step2 from "../Step2";

export default function Step2View({ data, onNext, onBack }) {
  return <Step2 savedRecords={data} onNext={onNext} onBack={onBack} />;
}
