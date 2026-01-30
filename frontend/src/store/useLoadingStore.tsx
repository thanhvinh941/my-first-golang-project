// stores/loading.store.ts
import { create } from "zustand";

type LoadingState = {
  appLoading: boolean;
  pageLoading: boolean;
  setAppLoading: (v: boolean) => void;
  setPageLoading: (v: boolean) => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  appLoading: true,
  pageLoading: false,
  setAppLoading: (v) => set({ appLoading: v }),
  setPageLoading: (v) => set({ pageLoading: v }),
}));
