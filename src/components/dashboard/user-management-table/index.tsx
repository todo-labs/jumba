import type { ColumnDef } from "@tanstack/react-table";
import type { Experiment, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { BatteryWarningIcon, Loader2Icon, User2Icon } from "lucide-react";

import { DataTable } from "@/components/query-table/data-table";
import { DataTableColumnHeader } from "@/components/query-table/header";
import { DataTableRowActions } from "./row-actions";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import DefaultState from "@/components/DefaultState";

import { api } from "@/utils/api";

type Column = User & { Experiment: Experiment[] };

const columns: ColumnDef<Column>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name") || "Anonymous"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return <div className="w-[100px]">{row.getValue("email")}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Joined" />
  //   ),
  //   cell: ({ row }) => {
  //     console.log(row)
  //     const date = new Date(row.getValue("createdAt"));

  //     if (!date) {
  //       return <Badge color="red">Not verified</Badge>;
  //     }

  //     const status = formatDistanceToNow(date, {
  //       addSuffix: true,
  //     });

  //     return <div className="w-[80px]">{status}</div>;
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "Experiment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="# of Experiments" />
    ),
    cell: ({ row }) => {
      // get status based on date
      const experiments = row.getValue("Experiment");
      if (
        !experiments ||
        (Array.isArray(experiments) && experiments.length === 0)
      ) {
        return <Badge variant="destructive">No experiments</Badge>;
      } else if (Array.isArray(experiments) && experiments.length > 0) {
        return (
          <div className="w-[100px] text-center">{experiments.length}</div>
        );
      }
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

const UserTable = () => {
  const { data, isLoading, isError, refetch } =
    api.admin.allUsers.useQuery(undefined);

  return isLoading ? (
    <DefaultState
      icon={Loader2Icon}
      iconClassName="animate-spin"
      title="Loading Users"
      description="Please wait while we load all the users"
    />
  ) : isError ? (
    <DefaultState
      icon={BatteryWarningIcon}
      title="Error loading Users"
      description="Something went wrong while loading the experiments"
      btnText="Retry"
      onClick={void refetch()}
    />
  ) : (
    <DataTable
      data={data}
      columns={columns}
      emptyState={
        <DefaultState
          title="No Users"
          description="No users found"
          icon={User2Icon}
        />
      }
    />
  );
};

export default UserTable;
