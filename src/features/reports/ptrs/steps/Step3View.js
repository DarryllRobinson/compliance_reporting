import React from "react";
import Step3 from "../Step3";

export default function Step3View({ data, onNext, onBack }) {
  return <Step3 savedRecords={data} onNext={onNext} onBack={onBack} />;
}
