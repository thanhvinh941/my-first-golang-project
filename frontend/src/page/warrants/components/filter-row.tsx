import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { CalendarIcon, XIcon } from "lucide-react";
import type { FieldName, FilterRow, Operator } from "../types";
import { useMemo } from "react";
import { fields, operators } from "../data/filter-config";

interface FilterRowProps {
    row: FilterRow;
    onChange: (updated: FilterRow) => void;
    onRemove: () => void;
}

export const FilterRowItem: React.FC<FilterRowProps> = ({
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