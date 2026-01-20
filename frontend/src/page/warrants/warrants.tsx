import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseWarrantStore } from "@/store/useWarrantStore";
import { useEffect, useState } from "react";
import { TooltipFilter } from "./components/tooltip-filter";

export default function Warrant() {
    const {
        data,
        analysisData,
        isLoading,
        error,
        fetchAllData,
        analysis
    } = UseWarrantStore();

    useEffect(() => {
        fetchAllData()
        analysis()
    }, [])

    const keys: string[] = Object.keys(data!);

    const [filterRows, setFilterRows] = useState<[]>([]);


    return (
        <>
            <div className="flex w-full flex-col gap-6">
                <Tabs defaultValue="analysis" className="w-full">
                    <TabsList>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="view">View</TabsTrigger>
                    </TabsList>
                    <TabsContent value="analysis" className="w-full overflow-auto">
                        <TooltipFilter onApply={(rows) => setFilterRows(rows)} />

                        <table className="w-full table-auto border-collapse text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left border">Symbol</th>
                                    <th className="p-2 text-left border">Breakeven Increase %</th>
                                    <th className="p-2 text-left border">Breakeven Price</th>
                                    <th className="p-2 text-left border">Reference Price</th>
                                    <th className="p-2 text-left border">Spot Price</th>
                                    <th className="p-2 text-left border">Days to Maturity</th>
                                    <th className="p-2 text-left border">Warrant Price</th>
                                    <th className="p-2 text-left border">Status</th>
                                    <th className="p-2 text-left border">Analysis Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analysisData.map((item) => (
                                    <tr key={item.symbol} className="even:bg-gray-50">
                                        <td className="p-2 border">{item.symbol}</td>
                                        <td className="p-2 border">{item.breakevenIncreasePct}</td>
                                        <td className="p-2 border">{item.breakevenPrice}</td>
                                        <td className="p-2 border">{item.referencePrice}</td>
                                        <td className="p-2 border">{item.spotPrice}</td>
                                        <td className="p-2 border">{item.daysToMaturity}</td>
                                        <td className="p-2 border">{item.warrantPrice}</td>
                                        <td className="p-2 border">{item.status}</td>
                                        <td className="p-2 border">{item.analysisDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TabsContent>


                    <TabsContent value="view" className="w-full">
                        <div className="flex w-full flex-col gap-6">
                            <Tabs defaultValue={keys[0]}>
                                <TabsList>
                                    {keys.map((key) => (
                                        <TabsTrigger key={key} value={key}>
                                            {key}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                {keys.map((key) => (
                                    <TabsContent key={key} value={key} className="w-full">
                                        <Card>
                                            <CardContent>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {data[key].map((item) => (
                                                        <div
                                                            key={item.symbol}
                                                            className="border rounded p-3 bg-white shadow-sm"
                                                        >
                                                            <h3 className="font-semibold text-base mb-1">
                                                                Symbol: {item.symbol}
                                                            </h3>
                                                            <p>
                                                                <strong>Name:</strong> {item.name1}
                                                            </p>
                                                            <p>
                                                                <strong>Exercise Price:</strong> {item.referencePrice}
                                                            </p>
                                                            <p>
                                                                <strong>Exercise Ratio:</strong> {item.exerciseRatio}
                                                            </p>
                                                            <p>
                                                                <strong>Exercise Price:</strong> {item.exercisePrice}
                                                            </p>
                                                            <p>
                                                                <strong>Last Trading Date:</strong> {item.lastTradingDate}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>


        </>

    );
}