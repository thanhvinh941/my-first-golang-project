import type { EtfDetailDto } from "@/store/useEtfStore"
import { columns } from "./colunms"
import { DataTable } from "./data-table"
import { cn } from "@/lib/utils"
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts"

interface EtfDetailProp {
    data: EtfDetailDto[] | [],
    className?: string
}

export default function EtfDetail({ data, className }: EtfDetailProp) {
    
const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1",
  "#14b8a6", "#8b5cf6", "#ec4899", "#f97316", "#22c55e",
  "#0ea5e9", "#84cc16", "#a855f7", "#d946ef", "#e11d48",
  "#06b6d4", "#ca8a04", "#16a34a", "#1d4ed8"
]

    const chartData = data.map((item) => ({
        name: item.stockSymbol,
        value: item.ratio,
        units: item.units,
    }))

    return (
        <>
            <div className={cn("container mx-auto py-10", className)}>
                {/* <DataTable columns={columns} data={data} /> */}
                <PieChart width={800} height={800}>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        label={({ name, units }) => `${name}: ${units}`}
                    >

                        {chartData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                        
                        {/* 
                        <Label
                            position="center"
                            content={() => (
                                <text
                                    x={190}
                                    y={190}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-xl font-bold"
                                >
                                    ETF Allocation
                                </text>
                            )}
                        /> */}
                    </Pie>

                    <Tooltip
                        formatter={(value, name, props) => {
                            const units = props.payload.units
                            return [`${units} units (${value}%)`, name]
                        }}
                        contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "10px",
                            border: "1px solid #e5e7eb",
                        }}
                    />

                </PieChart>
            </div>
            
        </>
    )
}