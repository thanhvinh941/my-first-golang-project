import { DataTable } from "./data-table"
import { columns } from "./colunms"
import type { FavoriteStockDto } from "@/store/useFavouriteStore"

interface FavouriteDataViewProp {
    data: FavoriteStockDto[]
}

export default function FavouriteDataView({data}: FavouriteDataViewProp) {
    return (
        <>
        <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
        </>
    )
}