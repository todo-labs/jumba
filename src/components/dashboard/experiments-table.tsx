import { Experiment } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/Checkbox";
import { DataTableColumnHeader } from "../query-table/header";
import { DataTableRowActions } from "../query-table/row-actions";
import DefaultState from "../DefaultState";
import { api } from "~/utils/api";
import { DataTable } from "../query-table/data-table";

const columns: ColumnDef<Experiment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tag" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("tag")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("category")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium capitalize">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "feeds",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feeds" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("feeds")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "creator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Creator" />
    ),
    cell: ({ row }) => {

      console.log(row.getValue("createdBy"));
      return (
        <div className="flex items-center">
          <span>{row.getValue("createdBy")?.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

const ExperimentTable = () => {
  const { data, isLoading, isError, refetch, isFetched } =
    api.experiments.getAll.useQuery(undefined);

  return isLoading ? (
    <DefaultState
      title="defaultHome.loading.title"
      description="defaultHome.loading.message"
    />
  ) : isError ? (
    <DefaultState
      title="defaultHome.error.title"
      description="defaultHome.error.message"
    />
  ) : (
    <DataTable data={data} columns={columns} />
  );
};

export default ExperimentTable;