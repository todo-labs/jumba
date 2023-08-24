import { type Reviews, Role } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

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

import { api } from "@/utils/api";
import { useToast } from "@/hooks/useToast";

const DeleteReviewModal: React.FC<Reviews> = (props) => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const deleteReview = api.admin.removeReview.useMutation({
    onSuccess() {
      toast({
        title: "Success",
        description: "The review was deleted successfully.",
      });
    },
    onError() {
      toast({
        title: "Error",
        description: "There was an error deleting the review.",
      });
    },
  });

  const handleDelete = async () => {
    try {
      await deleteReview.mutateAsync(props.id);
    } catch (error) {
      console.error(error);
    }
  };

  if (session?.user.role != Role.ADMIN) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger className="float-right">
        <Trash2Icon className="m-3 h-4 w-4 text-destructive" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            review.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => void handleDelete()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteReviewModal;
