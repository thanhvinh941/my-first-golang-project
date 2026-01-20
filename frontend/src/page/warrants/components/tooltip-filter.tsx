import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import type { FieldName, Operator, FilterRow as FilterRowType } from "../types";
interface Props {
    onApply: (rows: FilterRowType[]) => void;
}

export const TooltipFilter: React.FC<Props> = ({ onApply }) => {
    const [rows, setRows] = useState<FilterRowType[]>([
        { field: "", operator: "", value: "", valueTo: "" },
    ]);

    const addRow = () =>
        setRows([...rows, { field: "", operator: "", value: "", valueTo: "" }]);

    const updateRow = (index: number, updated: FilterRowType) => {
        const next = [...rows];
        next[index] = updated;
        setRows(next);
    };

    const removeRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleApply = () => {
        const clean = rows.filter((r) => r.field && r.operator && r.value);
        onApply(clean);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button className="px-3 py-1 bg-blue-600 text-white rounded">
                    Filter
                </button>
            </TooltipTrigger>

            <TooltipContent
                align="start"
                className="w-96 p-4 bg-white border shadow-lg"
            >
                <div className="space-y-3">
                    {rows.map((row, i) => (
                        <FilterRow
                            key={i}
                            row={row}
                            onChange={(r) => updateRow(i, r)}
                            onRemove={() => removeRow(i)}
                            onApply={onApply} />
                    ))}

                    <div className="flex justify-between items-center pt-3 border-t">
                        <button
                            onClick={addRow}
                            className="text-sm text-blue-600"
                        >
                            + Add condition
                        </button>
                        <button
                            onClick={handleApply}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    );
};


const fields: FieldName[] = [
    "symbol",
    "baseSymbol",
    "analysisDate",
    "spotPrice",
    "strikePrice",
    "riskFreeRate",
    "volatility",
    "conversionRatio",
    "referencePrice",
    "warrantPrice",
    "status",
    "breakevenIncreasePct",
    "breakevenPrice",
    "timeToMaturity",
];
const operators: Operator[] = ["LT", "GT", "EQ", "NE", "BETWEEN"];

interface Props {
    row: FilterRowType;
    onChange: (updated: FilterRowType) => void;
    onRemove: () => void;
}

export const FilterRow: React.FC<Props> = ({ row, onChange, onRemove }) => {
    return (
        <div className="flex gap-2 items-center">
            <select
                value={row.field}
                onChange={(e) =>
                    onChange({ ...row, field: e.target.value as FieldName })
                }
                className="border p-1 rounded"
            >
                <option value="">Field</option>
                {fields.map((f) => (
                    <option key={f} value={f}>
                        {f}
                    </option>
                ))}
            </select>

            <select
                value={row.operator}
                onChange={(e) =>
                    onChange({ ...row, operator: e.target.value as Operator })
                }
                className="border p-1 rounded"
            >
                <option value="">Operator</option>
                {operators.map((op) => (
                    <option key={op} value={op}>
                        {op}
                    </option>
                ))}
            </select>

            <input
                type="text"
                value={row.value}
                onChange={(e) => onChange({ ...row, value: e.target.value })}
                placeholder="Value"
                className="border p-1 rounded flex-1"
            />

            {/* Nếu operator là BETWEEN show valueTo */}
            {row.operator === "BETWEEN" && (
                <input
                    type="text"
                    value={row.valueTo}
                    onChange={(e) => onChange({ ...row, valueTo: e.target.value })}
                    placeholder="Value To"
                    className="border p-1 rounded flex-1"
                />
            )}

            <button
                onClick={onRemove}
                className="text-red-500 font-bold px-2"
            >
                ✕
            </button>
        </div>
    );
};