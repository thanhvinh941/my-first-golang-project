import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownAZIcon, ArrowDownZAIcon, MoveDownIcon, MoveUpIcon, XIcon } from "lucide-react";
import type { FieldName, SortDirection, SortRow } from "../types";
import { fields } from "../data/filter-config";

interface SortRowItemProps {
    index: number;
    total: number;
    row: SortRow;
    onChange: (updated: SortRow) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}

export const SortRowItem: React.FC<SortRowItemProps> = ({
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