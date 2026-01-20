    // types.ts

export type FieldName =
  | "symbol"
  | "baseSymbol"
  | "analysisDate"
  | "spotPrice"
  | "strikePrice"
  | "riskFreeRate"
  | "volatility"
  | "conversionRatio"
  | "referencePrice"
  | "warrantPrice"
  | "status"
  | "breakevenIncreasePct"
  | "breakevenPrice"
  | "timeToMaturity";

export type Operator = "LT" | "GT" | "EQ" | "NE" | "BETWEEN";

export interface FilterRow {
  field: FieldName | "";
  operator: Operator | "";
  value: string;
  valueTo: string;
}
