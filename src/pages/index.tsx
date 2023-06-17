import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import type { IExperiment } from "types";
import Link from "next/link";
import type { Category } from "@prisma/client";
import { ChefHatIcon, FileWarningIcon, Loader2Icon } from "lucide-react";

import Option from "~/components/Option";
import ExperimentCard from "~/components/Experiment";
import DefaultState from "~/components/DefaultState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";

import { UserNav } from "~/components/user/Nav";
import QueryWrapper from "~/components/QueryWrapper";

import { api } from "~/utils/api";
import { options } from "~/constants";
import CreateExperimentModal from "~/components/CreateExperimentModal";

const Home: NextPage = () => {
  const [selectedOption, setSelectedOption] = useState<Category>();
  const experimentsQuery = api.experiments.getAll.useQuery();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const handleOptionPress = (option: Category) => {
    setSelectedOption(option);
    setShowSidebar(true);
  };

  return (
    <div className="flex h-screen items-start justify-center">
      <Head>
        <title>Jumba</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full flex-col p-10">
        <section className="flex w-full justify-between">
          <Link
            className="text-4xl"
            href="https://blogr.conceptcodes.dev/introducing-jumba-ai"
          >
            Jumba
            <span className="text-primary">.</span>
          </Link>
          <div className="flex flex-row-reverse">
            <UserNav />
          </div>
        </section>

        <section className="mt-10 flex overflow-hidden overflow-x-scroll">
          {options.sort().map((option, index) => (
            <Option
              key={index}
              title={option.title}
              icon={option.icon}
              selected={selectedOption === option.title}
              onClick={() => handleOptionPress(option.title)}
            />
          ))}
        </section>

        <section className="mt-10 flex h-full flex-col">
          <h1 className="text-2xl xl:text-4xl">
            Past Experiments{" "}
            <span className="">({experimentsQuery.data?.length || 0})</span>
          </h1>
          <div className="mt-10">
            <QueryWrapper
              query={experimentsQuery}
              components={{
                Loading: () => (
                  <DefaultState
                    title="Loading Experiments..."
                    icon={Loader2Icon}
                    iconClassName="animate-spin"
                    description="We're working on loading all your experiments."
                    btnText=""
                    onClick={() => console.log("clicked")}
                  />
                ),
                Error: () => (
                  <DefaultState
                    title="Error Loading Experiments"
                    icon={FileWarningIcon}
                    description="We're having trouble loading your experiments. Please try again later."
                    btnText="retry"
                    onClick={void experimentsQuery.refetch()}
                  />
                ),
                Empty: () => (
                  <DefaultState
                    title="No Experiments Yet"
                    icon={ChefHatIcon}
                    description="This is kinda Awkward. you can be the first to upload an experiment."
                  />
                ),
              }}
              renderItem={(experiment: IExperiment, index: number) => (
                <ExperimentCard key={index} {...experiment} />
              )}
              height={400}
              containerStyle="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full items-start"
            />
          </div>
        </section>
      </main>
      <Dialog open={showSidebar} onOpenChange={setShowSidebar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              New{" "}
              <span className="capitalize text-primary">
                {selectedOption?.toLowerCase()}
              </span>{" "}
              Experiment
            </DialogTitle>
            <DialogDescription>
              Pick all the options needed to create your new experiment.
            </DialogDescription>
          </DialogHeader>
          <CreateExperimentModal
            category={selectedOption as Category}
            onClose={() => setShowSidebar(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
