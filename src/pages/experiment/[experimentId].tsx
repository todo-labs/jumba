import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";
import ReviewModal from '~/components/ReviewModal'

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";

import { api } from "~/utils/api";

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
        <div className="mt-3 flex flex-col lg:flex-row lg:items-center space-x-6 space-y-6">
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
                {experiment?.duration}{" "}
                Mins
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
          <ReviewModal />
        </div>
      </article>
    </div>
  );
};

export default ExperimentPage;
