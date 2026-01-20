import axios from "axios";
import { create } from "zustand";

export interface EtfStockDto {
    symbol: string,
    market: string,
    name1: string,
    name2: string,
    type: string,
    productId: string,
    referencePrice: number,
    ceilingPrice: number,
    floorPrice: number,
    previousVolume: number
}

export interface EtfDetailDto{
    stockSymbol: string,
    units: number,
    ratio: number,
    etfSymbol: string
}

export interface UseEtfStore {
    data: EtfStockDto[] | [];
    detail: EtfDetailDto[] | [];
    isLoading: boolean;
    error: string | null;
    fetchAllData: () => Promise<void>;
    getDetail: (symbol: string) => Promise<void>;
}

export const useEtfStore = create<UseEtfStore>((set) => ({
    data: [],
    detail: [],
    isLoading: false,
    error: null,
    fetchAllData: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get<EtfStockDto[]>(`api/etf`);
            set({ data: response.data, isLoading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, isLoading: false });
            } else {
                set({ error: 'An unknown error occurred', isLoading: false });
            }
        }
    },
    getDetail: async (symbol: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get<EtfDetailDto[]>(`api/etf/${symbol}`);
            set({ detail: response.data, isLoading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, isLoading: false });
            } else {
                set({ error: 'An unknown error occurred', isLoading: false });
            }
        }
    },
}))