import { create } from "zustand";
import type { SymbolInfoDto } from "./useSymbolStore";
import axios from "axios";
import type { FilterRow } from "@/page/warrants/types";

export interface WarrantDto {
    [key: string]: SymbolInfoDto;
}

export interface AnalysisDto {
    symbol: string,
    breakevenIncreasePct: number,
    breakevenPrice: number,
    referencePrice: number,
    spotPrice: number,
    daysToMaturity: number,
    warrantPrice: number,
    status: string,
    analysisDate: string
}

export interface UseWarrantState {
    data: WarrantDto;
    analysisData: AnalysisDto[] | [];
    isLoading: boolean;
    error: string | null;
    fetchAllData: () => Promise<void>;
    analysis: (filter?: FilterRow[]) => Promise<void>;
}

export const UseWarrantStore = create<UseWarrantState>((set) => ({
    data: {},
    analysisData: [],
    isLoading: false,
    error: null,
    fetchAllData: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get<WarrantDto>(`api/warrants`);
            set({ data: response.data, isLoading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, isLoading: false });
            } else {
                set({ error: 'An unknown error occurred', isLoading: false });
            }
        }
    },
    analysis: async (filter?: FilterRow[], sorts?: { field: string, direction: string }[]) => {
        set({ isLoading: true, error: null });
        const rest: FilterRow[] = [];
        try {
            const symbols: string[] = [];

            for (const f of filter!) {
                if (f.field === "symbol") {
                    // gom symbol
                    if (Array.isArray(f.value)) {
                        for (const v of f.value) {
                            const parts = String(v).split(",").map(s => s.trim()).filter(Boolean);
                            symbols.push(...parts);
                        }
                    } else if (f.value != null) {
                        const parts = String(f.value).split(",").map(s => s.trim()).filter(Boolean);
                        symbols.push(...parts);
                    }
                    // không push vào rest => loại bỏ filter symbol
                } else {
                    rest.push(f);
                }
            }

            let defaultBody: { symbols: string[], filters: FilterRow[][], sorts: { field: string, direction: string }[] } = {
                symbols: [],
                filters: [
                    [
                        {
                            field: "breakevenIncreasePct",
                            operator: "LT",
                            value: '10',
                        },
                        {
                            field: "warrantPrice",
                            operator: "NE",
                            value: '0',
                        },
                        {
                            field: "timeToMaturity",
                            operator: "GT",
                            value: '0.27',
                        },
                    ],
                ],
                sorts: [
                    {
                        field: "breakevenIncreasePct",
                        direction: "ASC",
                    },
                ],
            };

            if (rest) {
                defaultBody = { ...defaultBody, filters: [rest] }
            }

            if (symbols) {
                defaultBody = { ...defaultBody, symbols: symbols }
            }

            if(sorts) {
                defaultBody = { ...defaultBody, sorts: sorts }
            }

            const response = await axios.post<AnalysisDto[]>(`api/warrants/analysis`, defaultBody);
            set({ analysisData: response.data, isLoading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, isLoading: false });
            } else {
                set({ error: 'An unknown error occurred', isLoading: false });
            }
        }
    },
}))
