import { create } from "zustand";
import type { SymbolInfoDto } from "./useSymbolStore";
import axios from "axios";

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
    analysis: () => Promise<void>;
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
    analysis: async () => {
        set({ isLoading: true, error: null });
        try {
            var body = {
                symbols: [],
                filters: [
                    [
                        {
                            "field": "breakevenIncreasePct",
                            "operator": "LT",
                            "value": 10,
                            "valueTo": {}
                        },
                        {
                            "field": "warrantPrice",
                            "operator": "NE",
                            "value": 0,
                            "valueTo": {}
                        },
                        {
                            "field": "timeToMaturity",
                            "operator": "GT",
                            "value": 0.27,
                            "valueTo": {}
                        },
                        {
                            "field": "analysisDate",
                            "operator": "EQ",
                            "value": "2026-01-20",
                            "valueTo": {}
                        }
                    ]
                ],
                "sorts": [
                    {
                        "field": "breakevenIncreasePct",
                        "direction": "ASC"
                    }
                ]
            }
            const response = await axios.post<AnalysisDto[]>(`api/warrants/analysis`, body);
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
