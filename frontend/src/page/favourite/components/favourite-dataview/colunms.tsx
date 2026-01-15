
import type { ColumnDef } from "@tanstack/react-table";
import type { FavoriteStockDto } from "@/store/useFavouriteStore";

// Formatter cho số thập phân (giá)
const priceFmt = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Formatter cho số nguyên (khối lượng)
const intFmt = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
  maximumFractionDigits: 0,
});

export const columns: ColumnDef<FavoriteStockDto>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    enableSorting: true,
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    enableSorting: true,
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    meta: { align: "right" },
  },
  {
    accessorKey: "change",
    header: "Change",
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    meta: { align: "right" },
  },
  {
    accessorKey: "changePercent",
    header: "Change Percent",
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : intFmt.format(v);
    },
    meta: { align: "right" },
  },
];

