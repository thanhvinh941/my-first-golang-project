
export type Field = {
    name:
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
    | "timeToMaturity"
    | "daysToMaturity";
    type: "string" | "number" | "date";
};

// Operators
export type Operator = "" | "EQ" | "NE" | "GT" | "GE" | "LT" | "LE" | "BETWEEN" | "IN" | "NOT_IN" | "LIKE" | "STARTS_WITH";

// Row model
export interface FilterRowType {
    field: Field;
    operator: Operator;
    value: string | number | Date | null;
    valueTo?: string | number | Date | null;
}

export type FieldName =
    | ""
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

export interface FilterRow {
    field: FieldName;
    operator: Operator;
    value: string;
    valueTo?: string;
}


// Sort types
export type SortDirection = "ASC" | "DESC";

export interface SortRow {
  field: FieldName | "";
  direction: SortDirection | "";
}
