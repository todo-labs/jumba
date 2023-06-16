import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { format } from "date-fns";

import ReviewModal from "~/components/ReviewModal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";

import { api } from "~/utils/api";
import { displayUserName } from "~/utils";
import type { IExperiment } from "types";
import { ScrollArea } from "~/components/ui/ScrollArea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/Card";

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

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  console.log(experiment);

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
                    {displayUserName(experiment?.createdBy?.name)}
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
          <ScrollArea className="h-[500px] space-y-4">
            {experiment?.Reviews?.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
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
                        {format(review.createdAt, "MMMM dd, yyyy")}
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
        </div>
      </article>
    </div>
  );
};

export default ExperimentPage;
