import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { format } from "date-fns";

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
import FullScreenConfetti from "@/components/ui/Confetti";
import HeaderSection from "@/components/Header";
import Steps from "@/components/Steps";
import ShoppingList from "@/components/ShoppingList";

import { api } from "@/utils/api";
import { displayUserName, getInitials } from "@/utils";
import { IExperiment } from "types";

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

  const handleItemSelected = (item: Ingredient) => {
    setShoppingList((prev) => {
      return [...prev, item];
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="flex h-screen items-start justify-center">
      <Head>
        <title>{experiment?.title}</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="pointer-events-none fixed inset-0 z-50">
        <FullScreenConfetti active={completed} />
      </div>
      <article className="container min-h-screen w-3xl py-6 lg:py-12">
        <HeaderSection {...experiment} />
        <ListSection title="Ingredients" items={experiment?.rawIngredients} />
        <ShoppingList
          ingredients={experiment?.ingredients}
          shoppingList={shoppingList}
          handleItemSelected={handleItemSelected}
        />
        <Steps
          steps={experiment?.steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
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
