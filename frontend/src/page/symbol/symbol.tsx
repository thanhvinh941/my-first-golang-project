import { useEffect, type ChangeEvent } from "react";
import SymbolHeader from "./components/symbol-header";
import { useSymbolStore } from "@/store/useSymbolStore";
import SymbolDataView from "./components/symbol-dataview/page";

export default function Symbol() {

    const { data, isLoading, error, fetchAllData, syncData } = useSymbolStore();

    useEffect(() => {
        fetchAllData();
    }, []);

    function onSyncData(): void {
        syncData()
        fetchAllData();
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) : void {
        console.log("search with keyword: ", event.target.value)
    }

    if (isLoading) {
    return <div>Loading posts...</div>; // Display loader while loading
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error message
    }


    return (
        <>
            <SymbolHeader handleSearch={handleSearch} onSyncData={onSyncData}></SymbolHeader>
            <div className="flex">
                <SymbolDataView data={data} ></SymbolDataView>
                <div></div>
            </div>
        </>
    )
}