/**
 * Council Policy Kernel
 *
 * Pure policy outcome derivation. No file I/O. No imports.
 *
 * Given pre-computed gate failure lists and risk values, derives the
 * standard policy outcome fields used by council-run.mjs Stage 5.
 */

export function deriveCouncilPolicyOutcome({
    failedRequiredGates,
    failedOptionalGates,
    riskScore,
    maxRiskScore,
}) {
    const required_ok = failedRequiredGates.length === 0;
    const eligible_to_vote = required_ok;
    const low_risk = riskScore <= maxRiskScore;
    const recommended_vote = eligible_to_vote && low_risk ? "yes" : "no";

    const blocking_reasons = [];
    if (!required_ok)
        blocking_reasons.push(`Missing/Failed required gates: ${failedRequiredGates.join(", ")}`);
    if (!low_risk)
        blocking_reasons.push(
            `Risk score ${riskScore.toFixed(2)} exceeds threshold ${maxRiskScore.toFixed(2)}`
        );

    const warnings = [];
    if (failedOptionalGates.length > 0)
        warnings.push(`Optional gates failed: ${failedOptionalGates.join(", ")}`);

    return { required_ok, eligible_to_vote, low_risk, recommended_vote, blocking_reasons, warnings };
}
