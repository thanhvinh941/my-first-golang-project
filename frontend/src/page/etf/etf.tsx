import { useEtfStore } from "@/store/useEtfStore";
import EtfDataView from "./components/etf-dataview/page";
import { useCallback, useEffect, useState } from "react";
import EtfDetail from "./components/etf-detail/page";

export default function Etf() {

    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

    const {
        data,
        detail,
        isLoading,
        error,
        fetchAllData,
        getDetail
    } = useEtfStore();

    useEffect(() => {
        fetchAllData()
    }, [])

    const handleSelect = useCallback((symbol: string) => {
        setSelectedSymbol(symbol);
        getDetail(symbol);
    }, [getDetail]);

    return <>
        <div className="flex gap-1">
            <EtfDataView
                className="flex-3"
                onSelect={handleSelect}
                selectedSymbol={selectedSymbol}
                data={data} />
            <EtfDetail className="flex-2" data={detail}></EtfDetail>
        </div>
    </>
}