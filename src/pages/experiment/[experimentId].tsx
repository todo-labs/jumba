import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/Card";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { Textarea } from "~/components/ui/TextArea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Slider } from "~/components/ui/Slider";
import { Button } from "~/components/ui/Button";

import { api } from "~/utils/api";
import { type LeaveReview, leaveReviewSchema } from "~/schemas";
import { useToast } from "~/hooks/useToast";
import { Separator } from "~/components/ui/Separator";

const ExperimentPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
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

  const form = useForm<LeaveReview>({
    resolver: zodResolver(leaveReviewSchema),
    defaultValues: {
      comment: "",
      rating: 5,
      experimentId: experimentId as string,
    },
  });

  const leaveReviewMutation = api.experiments.leaveReview.useMutation({
    onSuccess() {
      toast({
        title: "Success",
        description: `Your review has been submitted`,
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const { data: session } = useSession();

  const displayUserName = (name: string | null | undefined) => {
    if (!name) return "N. A";
    const [firstName, lastName] = name.split(" ");
    if (!firstName || !lastName) return "N. A";
    else {
      return `${firstName[0] ?? "N"}. ${lastName ?? "Available"}`;
    }
  };

  const formatDate = (d: Date) => {
    const date = new Date(d);
    return `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  async function onSubmit(values: LeaveReview) {
    try {
      await leaveReviewMutation.mutateAsync({
        ...values,
        experimentId: experimentId as string,
      });
    } catch (error) {
      console.error(error);
    }
  }

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
            {experiment?.title}
          </h1>
          <blockquote className="flex flex-col border-l-2 py-6 pl-6 text-xl italic text-muted-foreground">
            {experiment?.inspiration}
          </blockquote>
        </div>
        <div className="mt-3 flex flex-col lg:flex-row lg:space-x-6">
          <div className="flex-1">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={experiment?.createdBy?.image as string} />
                  <AvatarFallback>
                    {displayUserName(experiment?.createdBy?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">
                    {displayUserName(experiment?.createdBy?.name)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(experiment?.createdAt!)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h1>
              Serves:{" "}
              <strong className="text-primary">{experiment?.feeds}</strong>
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
          {/* <h2
            className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0"
            id="Reviews"
          >
            Reviews
          </h2>
          {!!experiment?.Reviews && experiment.Reviews.length > 0 ? (
            <ScrollArea className="space-y-4">
              {experiment.Reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={review.reviewedBy?.image as string} />
                        <AvatarFallback>
                          {displayUserName(review.reviewedBy?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">
                          {displayUserName(review.reviewedBy?.name)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{review.comment}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={session?.user.image!} />
                    <AvatarFallback>
                      {displayUserName(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">
                      {displayUserName(session?.user?.name)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date())}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What did you think?</FormLabel>
                          <FormControl>
                            <Textarea
                              className="resize-none"
                              disabled={leaveReviewMutation.isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating: {field.value} / 10</FormLabel>
                          <FormDescription>
                            How would you rate this experiment?
                          </FormDescription>
                          <FormControl>
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              disabled={leaveReviewMutation.isLoading}
                              defaultValue={[field.value]}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={leaveReviewMutation.isLoading}
                    >
                      {leaveReviewMutation.isLoading ? (
                        <Loader2Icon className="mr-2 animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )} */}
        </div>
      </article>
    </div>
  );
};

export default ExperimentPage;
