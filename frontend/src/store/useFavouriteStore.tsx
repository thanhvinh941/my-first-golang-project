import axios from "axios";
import { create } from "zustand"

export interface SymbolDropdownDto {
    symbol: string,
    companyName: string
}

export interface FavoriteStockDto {
    symbol: string,
    companyName: string,
    price: number,
    change: number,
    changePercent: number
}


export interface UseFavouriteStore {
    data: FavoriteStockDto[] | [];
    symbolList: SymbolDropdownDto[] | [];
    isLoading: boolean;
    error: string | null;
    fetchDropdownData: () => Promise<void>;
    fetchAllData: () => Promise<void>;
    addFavourite: (symbol : string) => Promise<void>;
}

export const useFavouriteStore = create<UseFavouriteStore>((set) => ({
    data: [],
    symbolList: [],
    isLoading: false,
    error: null,
    fetchDropdownData: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get<SymbolDropdownDto[]>(`api/symbols/dropdown`);
            set({ symbolList: response.data, isLoading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, isLoading: false });
            } else {
                set({ error: 'An unknown error occurred', isLoading: false });
            }
        }
    },
    fetchAllData: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get<FavoriteStockDto[]>(`api/favourites`);
            set({ data: response.data, isLoading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, isLoading: false });
            } else {
                set({ error: 'An unknown error occurred', isLoading: false });
            }
        }
    },
    addFavourite: async (symbol : string) => {
        set({ isLoading: true, error: null });
        try {
            await axios.post<void>(`api/favourites`, {"symbol" : symbol});
            set({ isLoading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, isLoading: false });
            } else {
                set({ error: 'An unknown error occurred', isLoading: false });
            }
        }
    },
}

))