import type { Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "~/hooks/useToast";

import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
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
} from "~/components/ui/AlertDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";

import { api } from "~/utils/api";
import { format } from "date-fns";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const utils = api.useContext();

  const deleteMutation = api.experiments.remove.useMutation({
    async onSuccess() {
      await utils.experiments.getAll.invalidate();
    },
  });

  const handleDeleteReminder = async () => {
    try {
      await deleteMutation.mutateAsync({
        // TODO: fix this, use Experiment type instead of TData
        id: "",
      });
      toast({
        title: "Reminder deleted",
        description: "Your reminder has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <Dialog>
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
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <EyeIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                View Message
              </DropdownMenuItem>
            </DialogTrigger>
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
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReminder}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        {/* <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {row.original.title || "Message Title"}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground/70">
                To:{" "}
                <span className="text-primary">
                  {cleanPhoneNumber(row.original.recipient) ||
                    "+1 234 567 8900"}
                </span>
              </h3>
              <h3 className="text-sm font-medium text-muted-foreground/70">
                Delivery Date:{" "}
                <span className="text-primary">
                  {format(row.original.date, "MMM dd, yyyy")}
                </span>
              </h3>
              <h3 className="text-sm font-medium text-muted-foreground/70">
                Message Description
              </h3>
              {row.original.message || "Message Description"}
            </DialogDescription>
          </DialogHeader>
        </DialogContent> */}
      </Dialog>
    </AlertDialog>
  );
}