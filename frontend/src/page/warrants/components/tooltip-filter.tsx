
import { useMemo, useState } from "react";
import type {
    FieldName,
    Operator,
    FilterRow as FilterRowType,
    Field,
} from "../types";
import { InputGroup } from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ArrowDownAZIcon, ArrowDownZAIcon, CalendarIcon, MoveDownIcon, MoveUpIcon, PlusIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/* ===================== TYPES ===================== */

export type SortDirection = "ASC" | "DESC";

export interface SortRow {
    field: FieldName | "";
    direction: SortDirection | "";
}

interface Props {
    onApply: (rows: FilterRowType[]) => void;
    onApplySort?: (rows: SortRow[]) => void;
    onApplyAll?: (filters: FilterRowType[], sorts: SortRow[]) => void;
}

/* ===================== MAIN COMPONENT ===================== */

export const TooltipFilter: React.FC<Props> = ({
    onApply,
    onApplySort,
    onApplyAll,
}) => {
    /* -------- FILTER STATE -------- */
    const [rows, setRows] = useState<FilterRowType[]>([
        { field: "", operator: "", value: "", valueTo: "" },
    ]);

    const addRow = () =>
        setRows((prev) => [...prev, { field: "", operator: "", value: "", valueTo: "" }]);

    const updateRow = (index: number, updated: FilterRowType) => {
        const next = [...rows];
        next[index] = updated;
        setRows(next);
    };

    const removeRow = (index: number) =>
        setRows((prev) => prev.filter((_, i) => i !== index));

    const cleanFilters = (input: FilterRowType[]) =>
        input.filter((r) => r.field && r.operator && r.value);

    /* -------- SORT STATE -------- */
    const [sorts, setSorts] = useState<SortRow[]>([
        { field: "", direction: "ASC" },
    ]);

    const addSortRow = () =>
        setSorts((prev) => [...prev, { field: "", direction: "ASC" }]);

    const updateSortRow = (index: number, updated: SortRow) => {
        setSorts((prev) => {
            const next = [...prev];
            next[index] = updated;
            return next;
        });
    };

    const removeSortRow = (index: number) =>
        setSorts((prev) => prev.filter((_, i) => i !== index));

    const moveSortRow = (from: number, to: number) => {
        setSorts((prev) => {
            if (to < 0 || to >= prev.length) return prev;
            const next = [...prev];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            return next;
        });
    };

    const cleanSorts = (input: SortRow[]) =>
        input.filter((r) => r.field && r.direction);

    /* -------- ACTIONS -------- */
    const handleApplyUnified = () => {
        const cleanF = cleanFilters(rows);
        const cleanS = cleanSorts(sorts);
        if (onApplyAll) onApplyAll(cleanF, cleanS);
        else {
            onApply(cleanF);
            onApplySort?.(cleanS);
        }
    };

    const handleClearAll = () => {
        setRows([{ field: "", operator: "", value: "", valueTo: "" }]);
        setSorts([{ field: "", direction: "ASC" }]);
    };

    /* ===================== RENDER ===================== */

    return (
        <div className="w-full bg-background p-3 rounded-lg border shadow-md">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold uppercase text-muted-foreground">
                    Filter & Sort
                </div>
            </div>

            {/* Unified body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* ================= FILTER ================= */}
                <div className="border rounded-md p-3 bg-muted/30">
                    <div className="text-sm font-medium mb-2">Filters</div>
                    <div className="flex flex-col gap-2">
                        {rows.map((row, i) => (
                            <InputGroup key={i} className="border-none shadow-none">
                                <FilterRow
                                    row={row}
                                    onChange={(r) => updateRow(i, r)}
                                    onRemove={() => removeRow(i)}
                                />
                            </InputGroup>
                        ))}
                    </div>
                    <div className="mt-2">
                        <Button variant="outline" size="sm" onClick={addRow}>
                            <PlusIcon></PlusIcon>
                        </Button>
                    </div>
                </div>

                {/* ================= SORT ================= */}
                <div className="border rounded-md p-3 bg-muted/20">
                    <div className="text-sm font-medium mb-2">Sort</div>

                    <div className="flex flex-col gap-2">
                        {sorts.map((row, i) => (
                            <InputGroup key={`sort-${i}`} className="border-none shadow-none">
                                <SortRowItem
                                    index={i}
                                    total={sorts.length}
                                    row={row}
                                    onChange={(r) => updateSortRow(i, r)}
                                    onRemove={() => removeSortRow(i)}
                                    onMoveUp={() => moveSortRow(i, i - 1)}
                                    onMoveDown={() => moveSortRow(i, i + 1)}
                                />
                            </InputGroup>
                        ))}
                    </div>

                    <div className="mt-2">
                        <Button variant="outline" size="sm" onClick={addSortRow}>
                            <PlusIcon></PlusIcon>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer actions: unified */}
            <div className="mt-3">
                <ButtonGroup className="w-full justify-between">
                    <Button variant="ghost" size="sm" onClick={handleClearAll}>
                        Clear
                    </Button>
                    <Button variant="default" size="sm" onClick={handleApplyUnified}>
                        Apply
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

/* ===================== CONFIG ===================== */

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

/* ===================== FILTER ROW ===================== */

interface FilterRowProps {
    row: FilterRowType;
    onChange: (updated: FilterRowType) => void;
    onRemove: () => void;
}

export const FilterRow: React.FC<FilterRowProps> = ({
    row,
    onChange,
    onRemove,
}) => {


    const currentField = useMemo(
        () => fields.find((f) => f.name === row.field),
        [row.field]
    );

    const isDateField = currentField?.type === "date";
    const isBetween = row.operator === "BETWEEN";


    const toDate = (s?: string) => (s ? new Date(s) : undefined);
    const toISODate = (d?: Date) =>
        d ? format(d, "yyyy-MM-dd") : "";

    return (
        <div className="flex flex-1 gap-2 items-center bg-background border rounded-md px-2 py-1">
            <Select
                value={row.field}
                onValueChange={(value) => onChange({ ...row, field: value as FieldName })}
            >
                <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                    {fields.map((f) => (
                        <SelectItem key={f.name} value={f.name}>
                            {f.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={row.operator}
                onValueChange={(value) => onChange({ ...row, operator: value as Operator })}
            >
                <SelectTrigger className="min-w-30">
                    <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                    {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                            {op.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            {/* ===== Date field UI ===== */}
            {isDateField && (
                <>
                    {/* Value (single date or "from" for BETWEEN) */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-45 justify-start text-left font-normal",
                                    !row.value && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {row.value
                                    ? format(new Date(row.value), "dd/MM/yyyy")
                                    : "Chọn ngày"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={toDate(row.value)}
                                onSelect={(d) =>
                                    onChange({ ...row, value: toISODate(d || undefined) })
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    {/* ValueTo (only for BETWEEN) */}
                    {isBetween && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-45 justify-start text-left font-normal",
                                        !row.valueTo && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {row.valueTo
                                        ? format(new Date(row.valueTo), "dd/MM/yyyy")
                                        : "Đến ngày"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={toDate(row.valueTo)}
                                    onSelect={(d) =>
                                        onChange({ ...row, valueTo: toISODate(d || undefined) })
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                </>
            )}



            {/* ===== Non-date fallback inputs ===== */}
            {!isDateField && (
                <>
                    <Input
                        className="min-w-35"
                        value={row.value ?? ""}
                        onChange={(e) => onChange({ ...row, value: e.target.value })}
                        placeholder="Value"
                    />
                    {isBetween && (
                        <Input
                            className="min-w-35"
                            value={row.valueTo ?? ""}
                            onChange={(e) => onChange({ ...row, valueTo: e.target.value })}
                            placeholder="Value To"
                        />
                    )}
                </>
            )}


            <Button
                variant="ghost"
                onClick={onRemove}
                className="text-destructive hover:bg-destructive/10 px-2"
            >
                <XIcon></XIcon>
            </Button>
        </div>
    );
};

/* ===================== SORT ROW ===================== */

interface SortRowItemProps {
    index: number;
    total: number;
    row: SortRow;
    onChange: (updated: SortRow) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

const SortRowItem: React.FC<SortRowItemProps> = ({
    index,
    total,
    row,
    onChange,
    onRemove,
    onMoveUp,
    onMoveDown,
}) => {
    return (
        <div className="flex flex-1 gap-2 items-center bg-background border rounded-md px-2 py-1">
            <div className="px-2 py-1 text-xs rounded bg-primary/10 text-primary font-medium">
                {index + 1}
            </div>

            <Select
                value={row.field}
                onValueChange={(value) => onChange({ ...row, field: value as FieldName })}
            >
                <SelectTrigger className="min-w-45">
                    <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                    {fields.map((f) => (
                        <SelectItem key={f.name} value={f.name}>
                            {f.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={row.direction}
                onValueChange={(value) => onChange({ ...row, direction: value as SortDirection })}
            >
                <SelectTrigger className="min-w-32.5">
                    <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ASC"><ArrowDownAZIcon></ArrowDownAZIcon></SelectItem>
                    <SelectItem value="DESC"><ArrowDownZAIcon></ArrowDownZAIcon></SelectItem>
                </SelectContent>
            </Select>

            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={onMoveUp}
                >
                    <MoveUpIcon></MoveUpIcon>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === total - 1}
                    onClick={onMoveDown}
                >
                    <MoveDownIcon></MoveDownIcon>
                </Button>
            </div>

            <Button
                variant="ghost"
                onClick={onRemove}
                className="text-destructive hover:bg-destructive/10 px-2"
            >
                <XIcon></XIcon>
            </Button>
        </div>
    );
};