import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BotIcon, Loader2Icon, RefreshCcwIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

import { Textarea } from "@/components/ui/TextArea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

import { api } from "@/utils/api";
import { type LeaveReview, leaveReviewSchema } from "@/schemas";
import { useToast } from "@/hooks/useToast";
import { displayUserName, getInitials } from "@/utils";
import type { IExperiment } from "types";

interface IReviewCardProps {
  experiment: IExperiment;
}

const ReviewCard = (props: IReviewCardProps) => {
  const { toast } = useToast();

  const form = useForm<LeaveReview>({
    resolver: zodResolver(leaveReviewSchema),
    defaultValues: {
      rating: 5,
      experimentId: props.experiment.id,
    },
  });

  const { data: session } = useSession();

  const utils = api.useUtils();

  const leaveReviewMutation = api.experiments.leaveReview.useMutation({
    async onSuccess() {
      toast({
        title: "Success",
        description: `Your review has been submitted`,
      });
    },
    async onSettled() {
      form.reset();
      await utils.experiments.getOne.refetch();
    },
    onError(error) {
      toast({
        title: "Suggestion",
        description:
          error.message ||
          "Please provide a more constructive review of the content.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: LeaveReview) {
    try {
      await leaveReviewMutation.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h2
        className="mt-10 scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight first:mt-0"
        id="Reviews"
      >
        Leave a Review
      </h2>
      {(props.experiment?.reviews.length === 0 ||
        props.experiment.reviews.some(
          (e) => e.reviewedById != session?.user.id
        )) && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={session?.user.image!} />
                <AvatarFallback>
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  {displayUserName(session?.user?.name)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(), "MMMM dd, yyyy")}
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
                      <div className="flex items-center justify-between">
                        <FormLabel>Comment</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          disabled={leaveReviewMutation.isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please share your thoughts and insights by leaving a
                        review comment. Your feedback is invaluable in helping
                        us improve and provide a better experience for our
                        users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription className="float-right">
                        Rating:{" "}
                        <span className="text-primary">{field.value}</span> / 10
                      </FormDescription>
                      <FormLabel>How would you rate this experiment?</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          disabled={leaveReviewMutation.isLoading}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="tt-6 w-full"
                  type="submit"
                  disabled={leaveReviewMutation.isLoading}
                >
                  {leaveReviewMutation.isLoading && (
                    <Loader2Icon className="mr-2 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

ReviewCard.displayName = "ReviewCard";

export default ReviewCard;
