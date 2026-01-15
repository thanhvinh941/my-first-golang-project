import type { SymbolInfoDto } from "@/store/useSymbolStore"
import { DataTable } from "./data-table"
import { columns } from "./colunms"

interface SymbolDataViewProp {
    data: SymbolInfoDto[]
}

export default function SymbolDataView({data}: SymbolDataViewProp) {
    return (
        <>
        <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
        </>
    )
}