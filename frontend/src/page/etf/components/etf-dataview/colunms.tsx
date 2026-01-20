
import type { ColumnDef } from "@tanstack/react-table";
import type { EtfStockDto } from "@/store/useEtfStore";

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

export const columns: ColumnDef<EtfStockDto>[] = [
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
    accessorKey: 'name1',
    header: 'Name 1',
    cell: ({ getValue }) => String(getValue() ?? ''),
    enableSorting: true,
  },
  {
    accessorKey: 'referencePrice',
    header: 'Reference Price',
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    enableSorting: true,
    meta: { align: 'right' }, // tuỳ UI layer của bạn có đọc meta không
  },
  {
    accessorKey: 'ceilingPrice',
    header: 'Ceiling Price',
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    enableSorting: true,
    meta: { align: 'right' },
  },
  {
    accessorKey: 'floorPrice',
    header: 'Floor Price',
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    enableSorting: true,
    meta: { align: 'right' },
  },
  {
    accessorKey: 'previousVolume',
    header: 'Previous Volume',
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : intFmt.format(v);
    },
    enableSorting: true,
    meta: { align: 'right' },
  },

];

