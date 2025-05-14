import React from "react";
import Step1 from "../Step1";

export default function Step1View({ data, onNext }) {
  return <Step1 savedRecords={data} onNext={onNext} />;
}
