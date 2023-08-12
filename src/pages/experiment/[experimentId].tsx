import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { format } from "date-fns";
import type { IExperiment } from "types";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

import ReviewModal from "@/components/Review";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ScrollArea } from "@/components/ui/ScrollArea";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
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
import { displayUserName, getInitials } from "@/utils";
import DefaultState from "@/components/DefaultState";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

const ExperimentPage: NextPage = () => {
  const router = useRouter();
  const { experimentId } = router.query;
  const {
    data: experiment,
    isError,
    isLoading,
  } = api.experiments.getOne.useQuery(
    { id: experimentId as string },
    {
      enabled: !!experimentId,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  const { toast } = useToast();

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

  const handleDelete = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  const { data: session } = useSession();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="flex h-screen items-start justify-center">
      <Head>
        <title>{experiment?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <article className="container min-h-screen max-w-3xl py-6 lg:py-12">
        <div className="space-y-4">
          <h1 className="font-heading inline-block text-4xl lg:text-5xl">
            <strong className="text-primary">#{experiment?.tag}</strong>{" "}
            {experiment?.title}
          </h1>
          <blockquote className="flex flex-col border-l-2 py-6 pl-6 text-xl italic text-muted-foreground">
            {experiment?.inspiration}
          </blockquote>
        </div>
        <div className="mt-3 flex flex-col space-x-6 space-y-6 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={experiment?.createdBy?.image as string} />
                  <AvatarFallback>
                    {getInitials(experiment?.createdBy?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">
                    {displayUserName(experiment?.createdBy?.name)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {format(experiment?.createdAt as Date, "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h1>
              Feeds:{" "}
              <strong className="text-primary">
                {experiment?.feeds}
                {experiment?.feeds === 1 ? " person" : " people"}
              </strong>
            </h1>
          </div>
          <div className="flex-1">
            <h1>
              Duration:{" "}
              <strong className="text-primary">
                {experiment?.duration} Mins
              </strong>
            </h1>
          </div>
        </div>
        <div>
          <h2
            className="scroll-m-20 border-b pb-1 pt-10 text-3xl font-semibold tracking-tight first:mt-0"
            id="what-data-we-collect"
          >
            Ingredients
          </h2>
          <ul className="list-inside list-disc space-y-3">
            {experiment?.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <h2
            className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0"
            id="steps"
          >
            Steps
          </h2>
          <ol className="list-inside list-decimal space-y-2">
            {experiment?.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <ReviewModal experiment={experiment as IExperiment} />
          <ScrollArea className="max-h-[500px] py-3">
            {experiment?.Reviews?.map((review) => (
              <Card key={review.id} className="mb-3">
                {session?.user.role === Role.ADMIN && (
                  <AlertDialog>
                    <AlertDialogTrigger className="float-right">
                      <Trash2Icon className="m-3 h-4 w-4 text-destructive" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this review.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => void handleDelete(review.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <CardHeader className="flex flex-row items-center justify-between space-x-3">
                  <div className="flex space-x-3">
                    <Avatar>
                      <AvatarImage src={review.reviewedBy?.image as string} />
                      <AvatarFallback>
                        {getInitials(review.reviewedBy?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {displayUserName(review.reviewedBy?.name)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(review.createdAt, "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    <strong className="text-primary">{review.rating}</strong> /
                    10
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <blockquote>{review.comment}</blockquote>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>
      </article>
    </div>
  );
};

export default ExperimentPage;
