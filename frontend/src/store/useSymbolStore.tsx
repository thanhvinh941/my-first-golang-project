import axios from "axios";
import { create } from "zustand";

export interface SymbolInfoDto {
    symbol: string;
    market: string;
    name1: string;
    name2: string;
    type: string;
    productId: string;
    referencePrice: number; // BigDecimal -> number
    ceilingPrice: number;   // BigDecimal -> number
    floorPrice: number;     // BigDecimal -> number
    previousVolume: number; // Integer -> number
}


export interface UseSymbolState {
    data: SymbolInfoDto[] | [];
    isLoading: boolean;
    error: string | null;
    fetchAllData: () => Promise<void>;
    syncData: () => Promise<void>
}

export const useSymbolStore = create<UseSymbolState>(
    (set) => (
        {
            data: [],
            isLoading: false,
            error: null,
            fetchAllData: async () => {
                set({ isLoading: true, error: null });
                try {
                    // Use 'axios' or 'fetch' to make the API request
                    const response = await axios.get<SymbolInfoDto[]>(`api/symbols`);
                    set({ data: response.data, isLoading: false });
                } catch (err) {
                    if (err instanceof Error) {
                        set({ error: err.message, isLoading: false });
                    } else {
                        set({ error: 'An unknown error occurred', isLoading: false });
                    }
                }
            },
            syncData: async () => {
                set({ isLoading: true, error: null });
                try {
                    // Use 'axios' or 'fetch' to make the API request
                    await axios.get<void>(`/api/job/sync-data`);
                    set({ isLoading: false });
                } catch (err) {
                    if (err instanceof Error) {
                        set({ error: err.message, isLoading: false });
                    } else {
                        set({ error: 'An unknown error occurred', isLoading: false });
                    }
                }
            }
        }
    )
)