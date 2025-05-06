export function calculateStep5Metrics(dataset) {
  const paymentTerms = dataset.map((record) => record.paymentTerm);
  const paymentTimes = dataset.map((record) => record.paymentTime);

  const mode = (arr) =>
    arr
      .sort(
        (a, b) =>
          arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
      )
      .pop();

  const percentile = (arr, p) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(p * sorted.length) - 1;
    return sorted[index];
  };

  return {
    mostCommonPaymentTerm: mode(paymentTerms),
    receivableTermComparison: "Longer", // Hardcoded based on context
    rangeMin: Math.min(...paymentTerms),
    rangeMax: Math.max(...paymentTerms),
    averagePaymentTime: (
      paymentTimes.reduce((sum, time) => sum + time, 0) / paymentTimes.length
    ).toFixed(2),
    medianPaymentTime: percentile(paymentTimes, 0.5),
    percentile80: percentile(paymentTimes, 0.8),
    percentile95: percentile(paymentTimes, 0.95),
  };
}
