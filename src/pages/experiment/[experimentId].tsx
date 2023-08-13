import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { format } from "date-fns";
import type { IExperiment } from "types";

import ReviewCard from "@/components/cards/Review";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/Card";
import DeleteReviewModal from "@/components/modals/DeleteReviewModal";
import Option from "@/components/cards/Option";
import { Checkbox } from "@/components/ui/Checkbox";

import { api } from "@/utils/api";
import { cn, displayUserName, getInitials } from "@/utils";
import Step from "@/components/cards/Step";
import FullScreenConfetti from "@/components/ui/Confetti";

interface ListSectionProps {
  title: string;
  items: string[] | undefined;
  order?: boolean;
}

const ListSection = ({ title, items, order = false }: ListSectionProps) => {
  if (!items) return <div>No Data to show</div>;
  return (
    <div className="mt-10 scroll-m-20 border-b pb-10 first:mt-0">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">{title}</h1>
      {order ? (
        <ol className="list-inside list-disc space-y-2">
          {items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-inside list-disc space-y-2">
          {items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

type HeaderSectionProps =
  | "feeds"
  | "tag"
  | "title"
  | "createdBy"
  | "duration"
  | "createdAt"
  | "inspiration";

const HeaderSection = (
  props: Pick<Partial<IExperiment>, HeaderSectionProps>
) => {
  return (
    <React.Fragment>
      <div className="space-y-4">
        <h1 className="font-heading inline-block text-4xl lg:text-5xl">
          <strong className="text-primary">#{props.tag}</strong> {props.title}
        </h1>
        <blockquote className="flex flex-col border-l-2 py-6 pl-6 text-xl italic text-muted-foreground">
          {props.inspiration}
        </blockquote>
      </div>
      <div className="mt-3 flex flex-col space-x-6 space-y-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={props.createdBy?.image as string} />
                <AvatarFallback>
                  {getInitials(props.createdBy?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">
                  {displayUserName(props?.createdBy?.name)}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {props.createdAt
                    ? format(props.createdAt || new Date(), "MMMM dd, yyyy")
                    : "Unavailable"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h1>
            Feeds:{" "}
            <strong className="text-primary">
              {props.feeds}
              {props.feeds === 1 ? " person" : " people"}
            </strong>
          </h1>
        </div>
        <div className="flex-1">
          <h1>
            Duration:{" "}
            <strong className="text-primary">{props.duration} Mins</strong>
          </h1>
        </div>
      </div>
    </React.Fragment>
  );
};

type Ingredient = IExperiment["ingredients"][0];

const ExperimentPage: NextPage = () => {
  const router = useRouter();
  const [shoppingList, setShoppingList] = React.useState<Ingredient[]>([]);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);

  const { experimentId } = router.query;
  const {
    data: experiment,
    isError,
    isLoading,
  } = api.experiments.getOne.useQuery(
    { id: experimentId as string },
    {
      enabled: !!experimentId,
      staleTime: 7 * 24 * 60 * 60 * 1000,
    }
  );

  React.useEffect(() => {
    if (completed) {
      setTimeout(() => {
        setCompleted(false);
      }, 5000);
    } else {
      if (currentStep === experiment?.steps.length) {
        setCompleted(true);
      }
    }
  }, [setCompleted, setCompleted, currentStep]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const handleItemSelected = (item: Ingredient) => {
    setShoppingList((prev) => {
      return [...prev, item];
    });
  };

  return (
    <div className="flex h-screen items-start justify-center">
      <Head>
        <title>{experiment?.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pointer-events-none fixed inset-0 z-50">
        <FullScreenConfetti active={completed} />
      </div>
      <article className="container min-h-screen max-w-3xl py-6 lg:py-12">
        <HeaderSection {...experiment} />
        <ListSection title="Ingredients" items={experiment?.rawIngredients} />
        <h1 className="my-6 text-3xl font-semibold tracking-tight">
          Shopping List
        </h1>
        <section className="flex overflow-hidden overflow-x-scroll">
          {experiment?.ingredients
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((ingredient, index) => (
              <Option
                key={index}
                title={ingredient.name}
                icon={ingredient.icon}
                onClick={() => handleItemSelected(ingredient)}
                selected={
                  !!shoppingList.find((item) => item.name === ingredient.name)
                }
              />
            ))}
        </section>
        <h1 className="my-6 text-3xl font-semibold tracking-tight">Steps</h1>
        <ol className="list-inside list-decimal space-y-2">
          {experiment?.steps?.map((item, index) => (
            <Step
              key={index}
              title={item}
              index={index}
              completed={index < currentStep}
              active={index === currentStep}
              onCompleted={() => setCurrentStep((prev) => prev + 1)}
            />
          ))}
        </ol>
        <ReviewCard experiment={experiment as IExperiment} />
        <ScrollArea className="max-h-[500px] py-3">
          {experiment?.reviews?.map((review) => (
            <Card key={review.id} className="mb-3">
              <DeleteReviewModal {...review} />
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
                  <strong className="text-primary">{review.rating}</strong> / 10
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
      </article>
    </div>
  );
};

export default ExperimentPage;
