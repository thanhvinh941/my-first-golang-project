
import { useState } from "react";
import type {
    FilterRow as FilterRowType,
    FilterRow,
    SortRow,
} from "../types";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { PlusIcon } from "lucide-react";
import { SortRowItem } from "./sort-row-item";
import { FilterRowItem } from "./filter-row";

/* ===================== TYPES ===================== */


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
    const [rows, setRows] = useState<FilterRow[]>([
        { field: "", operator: "", value: "", valueTo: "" },
    ]);

    const addRow = () =>
        setRows((prev) => [...prev, { field: "", operator: "", value: "", valueTo: "" }]);

    const updateRow = (index: number, updated: FilterRow) => {
        const next = [...rows];
        next[index] = updated;
        setRows(next);
    };

    const removeRow = (index: number) =>
        setRows((prev) => prev.filter((_, i) => i !== index));

    const cleanFilters = (input: FilterRow[]) =>
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
                                <FilterRowItem
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