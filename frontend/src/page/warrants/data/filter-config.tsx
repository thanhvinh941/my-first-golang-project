/* ===================== CONFIG ===================== */

import type { Field, Operator } from "../types";

export const fields: Field[] = [
    { name: "symbol", type: "string" },
    { name: "baseSymbol", type: "string" },
    { name: "analysisDate", type: "date" },
    { name: "spotPrice", type: "number" },
    { name: "strikePrice", type: "number" },
    { name: "riskFreeRate", type: "number" },
    { name: "volatility", type: "number" },
    { name: "conversionRatio", type: "number" },
    { name: "referencePrice", type: "number" },
    { name: "warrantPrice", type: "number" },
    { name: "status", type: "string" },
    { name: "breakevenIncreasePct", type: "number" },
    { name: "breakevenPrice", type: "number" },
    { name: "timeToMaturity", type: "number" },
    { name: "daysToMaturity", type: "date" },
];

export const operators: { label: string; value: Operator }[] = [
    { label: "=", value: "EQ" },
    { label: "≠", value: "NE" },
    { label: ">", value: "GT" },
    { label: "≥", value: "GE" },
    { label: "<", value: "LT" },
    { label: "≤", value: "LE" },
    { label: "Between", value: "BETWEEN" },
    { label: "In", value: "IN" },
    { label: "Not In", value: "NOT_IN" },
    { label: "Like", value: "LIKE" },
    { label: "Starts With", value: "STARTS_WITH" },
];
