import type { Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontal, Trash } from "lucide-react";
import type { Experiment, User } from "@prisma/client";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";

import { toast } from "@/hooks/useToast";
import { api } from "@/utils/api";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps<User>) {
  const utils = api.useContext();

  const deleteMutation = api.admin.removeUser.useMutation({
    async onSuccess() {
      toast({
        title: "User deleted",
        description: `User ${row.original.name || "NA"} has been deleted.`,
      });
      await utils.admin.allUsers.invalidate();
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(row.original.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() =>
              window.open(`/experiment/${row.original.id}`, "_blank")
            }
          >
            <EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            View Experiment
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this user
            record and all their associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
