
import type { EtfDetailDto } from "@/store/useEtfStore";
import type { ColumnDef } from "@tanstack/react-table";

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

export const columns: ColumnDef<EtfDetailDto>[] = [
  {
    accessorKey: "stockSymbol",
    header: "Symbol",
    enableSorting: true,
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
  {
    accessorKey: 'units',
    header: 'Units',
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : intFmt.format(v);
    },
    enableSorting: true,
    meta: { align: 'right' }, // tuỳ UI layer của bạn có đọc meta không
  },
  {
    accessorKey: 'ratio',
    header: 'Ratio',
    cell: ({ getValue }) => {
      const v = getValue() as number | null | undefined;
      return v == null ? "" : priceFmt.format(v);
    },
    enableSorting: true,
    meta: { align: 'right' },
  }

];

