
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroupButton } from "@/components/ui/input-group";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavouriteStore, type SymbolDropdownDto } from "@/store/useFavouriteStore";
import FavouriteDataView from "./components/favourite-dataview/page";

export default function Favourite() {
    const {
        data,
        symbolList,
        isLoading,
        error,
        fetchAllData,
        fetchDropdownData,
        addFavourite,
    } = useFavouriteStore();

    // Dùng 1 state duy nhất cho giá trị chọn
    const [selected, setSelected] = React.useState<string>("");

    // Popover control
    const [open, setOpen] = React.useState<boolean>(false);

    // Chạy fetch khi mount (1 lần)
    React.useEffect(() => {
        // nếu fetchAllData/fetchDropdownData là stable (tạo sẵn trong store) thì ok
        // nếu ESLint cảnh báo deps, có thể thêm // eslint-disable-next-line hoặc wrap trong useCallback ở store
        fetchAllData?.();
        fetchDropdownData?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Tìm item đang được chọn (hiển thị label)
    const selectedItem = React.useMemo(
        () => symbolList?.find((x) => x.symbol === selected),
        [symbolList, selected]
    );

    const onSelectSymbol = React.useCallback(
        (value: string) => {
            setSelected((prev) => (prev === value ? "" : value));
            setOpen(false);
        },
        []
    );

    const handleAddFavourite = React.useCallback(() => {
        if (!selected) return;
        addFavourite?.(selected);
    }, [addFavourite, selected]);

    const hasData = Array.isArray(symbolList) && symbolList.length > 0;

    return (
        <>
            <div className="space-y-3">
                {/* POPUP SELECTOR */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-64 justify-between"
                            disabled={isLoading || !!error}
                        >
                            {isLoading ? (
                                <span className="text-muted-foreground">Đang tải…</span>
                            ) : error ? (
                                <span className="text-red-500">Lỗi tải dữ liệu</span>
                            ) : selectedItem ? (
                                <span className="truncate">
                                    {selectedItem.symbol}
                                    {selectedItem.companyName ? ` | ${selectedItem.companyName}` : ""}
                                </span>
                            ) : (
                                <span className="text-muted-foreground">Chọn mã chứng khoán</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-64 p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Tìm mã / tên công ty…" className="h-9" />
                            <CommandList>
                                {isLoading ? (
                                    <div className="p-3 text-sm text-muted-foreground">Đang tải…</div>
                                ) : error ? (
                                    <div className="p-3 text-sm text-red-500">
                                        Có lỗi khi tải danh sách. Vui lòng thử lại.
                                    </div>
                                ) : !hasData ? (
                                    <CommandEmpty>Không có dữ liệu</CommandEmpty>
                                ) : (
                                    <CommandGroup heading="Symbols">
                                        {symbolList.map((item: SymbolDropdownDto) => {
                                            const isActive = selected === item.symbol;
                                            return (
                                                <CommandItem
                                                    key={item.symbol}
                                                    // `value` dùng cho filter trong CommandInput
                                                    value={`${item.symbol} ${item.companyName ?? ""}`.trim()}
                                                    onSelect={() => onSelectSymbol(item.symbol)}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="min-w-0">
                                                        <div className="font-medium">{item.symbol}</div>
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            {item.symbol} | {item.companyName}
                                                        </div>
                                                    </div>
                                                    <Check
                                                        className={cn(
                                                            "ml-2 h-4 w-4 shrink-0 transition-opacity",
                                                            isActive ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* OPTIONAL: Select gốc của bạn (đã sync với state `selected`)
      <Select value={selected} onValueChange={setSelected} disabled={!hasData || isLoading}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select symbol" />
        </SelectTrigger>
        <SelectContent>
          {!hasData ? (
            <div className="px-3 py-2 text-muted-foreground">Không có dữ liệu</div>
          ) : (
            symbolList.map((e) => (
              <SelectItem key={e.symbol} value={e.symbol}>
                {e.symbol} | {e.companyName }
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select> */}

                {selected && (
                    <div className="text-sm text-muted-foreground">
                        Đã chọn: <span className="font-medium">{selected}</span>
                    </div>
                )}

                <InputGroupButton
                    size="sm"
                    className="ml-auto"
                    variant="default"
                    onClick={handleAddFavourite}
                    disabled={!selected}
                >
                    Add Favourite <PlusIcon className="ml-1 h-4 w-4" />
                </InputGroupButton>
            </div>
            <FavouriteDataView data={data} />
        </>

    );
}
