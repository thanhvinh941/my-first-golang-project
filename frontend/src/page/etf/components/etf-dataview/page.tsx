import { DataTable } from "./data-table"
import { columns } from "./colunms"
import type { EtfStockDto } from "@/store/useEtfStore"
import { cn } from "@/lib/utils";

interface EtfDataViewProp {
    data: EtfStockDto[],
    onSelect: (symbol: string) => void;
    selectedSymbol?: string | null
    className?: string
}

export default function EtfDataView({ className, data, onSelect, selectedSymbol }: EtfDataViewProp) {
    return (
        <>
            <div className={cn("container mx-auto py-10", className)}>
                <DataTable onSelect={onSelect}
                    selectedSymbol={selectedSymbol}
                    columns={columns} data={data}
                    getRowSymbol={(row) => row.symbol}
                    getRowId={(row) => row.symbol}
                />
            </div>
        </>
    )
}