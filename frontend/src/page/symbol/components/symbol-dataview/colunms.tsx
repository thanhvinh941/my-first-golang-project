
import type { ColumnDef } from "@tanstack/react-table";
import type { SymbolInfoDto } from "@/store/useSymbolStore";

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

export const columns: ColumnDef<SymbolInfoDto>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    enableSorting: true,
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
  {
    accessorKey: "market",
    header: "Market",
    enableSorting: true,
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
  {
    accessorKey: "name1",
    header: "Name 1",
    enableSorting: true,
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
//   {
//     accessorKey: "name2",
//     header: "Name 2",
//     enableSorting: true,
//     cell: ({ getValue }) => String(getValue() ?? ""),
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//     enableSorting: true,
//     cell: ({ getValue }) => String(getValue() ?? ""),
//   },
//   {
//     accessorKey: "productId",
//     header: "Product ID",
//     enableSorting: true,
//     cell: ({ getValue }) => String(getValue() ?? ""),
//   },
  {
    accessorKey: "referencePrice",
    header: "Reference Price",
    enableSorting: true,
    // Căn phải cho cột số + định dạng
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    meta: { align: "right" },
  },
  {
    accessorKey: "ceilingPrice",
    header: "Ceiling Price",
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    meta: { align: "right" },
  },
  {
    accessorKey: "floorPrice",
    header: "Floor Price",
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    meta: { align: "right" },
  },
  {
    accessorKey: "previousVolume",
    header: "Previous Volume",
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : intFmt.format(v);
    },
    meta: { align: "right" },
  },
];

