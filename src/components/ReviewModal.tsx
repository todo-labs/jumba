import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

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
import { ScrollArea } from "~/components/ui/ScrollArea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";

import { api } from "~/utils/api";
import { type LeaveReview, leaveReviewSchema } from "~/schemas";
import { useToast } from "~/hooks/useToast";
import { displayUserName } from "~/utils";
import type { IExperiment } from "types";

interface IReviewModalProps {
  experiment: IExperiment;
}

// TODO: show create review modal if user has not left a review yet, keep it sticky to top

const ReviewModal = (props: IReviewModalProps) => {
  const { toast } = useToast();

  const form = useForm<LeaveReview>({
    resolver: zodResolver(leaveReviewSchema),
    defaultValues: {
      comment: "",
      rating: 5,
      experimentId: props.experiment.id,
    },
  });

  const { data: session } = useSession();

  const utils = api.useContext();

  const leaveReviewMutation = api.experiments.leaveReview.useMutation({
    async onSuccess() {
      toast({
        title: "Success",
        description: `Your review has been submitted`,
      });
      await utils.experiments.getOne.invalidate();
    },
    onError(error) {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: LeaveReview) {
    try {
      await leaveReviewMutation.mutateAsync({
        ...values,
        experimentId: props.experiment.id,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h2
        className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0"
        id="Reviews"
      >
        Reviews
      </h2>
      {props.experiment?.Reviews.length === 0 ||
        (props.experiment.Reviews.some(
          (e) => e.reviewedById === session?.user.id
        ) && (
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
                            onValueChange={(value) => field.onChange(value[0])}
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
        ))}
    </>
  );
};

export default ReviewModal;
