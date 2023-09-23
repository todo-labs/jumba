import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import type { IExperiment } from "types";
import Link from "next/link";
import { Category } from "@prisma/client";
import {
  ChefHatIcon,
  FileWarningIcon,
  Loader2Icon,
  CircleOffIcon,
} from "lucide-react";

import Option from "@/components/cards/Option";
import ExperimentCard from "@/components/cards/Experiment";
import DefaultState from "@/components/DefaultState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { UserNav } from "@/components/user/Nav";
import QueryWrapper from "@/components/QueryWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import CreateExperimentModal from "@/components/modals/CreateExperimentModal";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";

import { api } from "@/utils/api";
import { options } from "@/utils/constants";
import { useMixpanel } from "@/utils/mixpanel";

const Home: NextPage = () => {
  const [selectedOption, setSelectedOption] = useState<Category>();
  const [categoryFilter, setCategoryFilter] = useState<Category>();
  const experimentsQuery = api.experiments.getAll.useQuery({
    category: categoryFilter,
  });
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const { trackEvent } = useMixpanel();

  const handleOptionPress = (option: Category) => {
    setSelectedOption(option);
    setShowSidebar(true);
    trackEvent("ButtonClick", {
      label: `Option`,
      value: option,
    });
  };

  const handleReset = () => {
    setCategoryFilter(undefined);
    trackEvent("ButtonClick", {
      label: "Reset",
    });
  };

  const handleRefetch = () => {
    experimentsQuery.refetch();
    trackEvent("ButtonClick", {
      label: "Refetch",
    });
  };

  const handleClose = () => {
    setShowSidebar(false);
    trackEvent("ButtonClick", {
      label: "Close",
    });
  };

  const handleChooseCategory = (category: Category) => {
    setCategoryFilter(category);
    trackEvent("Filter", {
      label: "Choose Category",
      value: category,
    });
  };

  return (
    <div className="flex h-screen items-start justify-center">
      <Head>
        <title>Jumba</title>
        <link rel="icon" href="/logo.svg" />
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
        <ScrollArea className="mt-10 flex">
          <div className="flex space-x-4 pb-4">
            {options
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((option, index) => (
                <Option
                  key={index}
                  title={option.title}
                  icon={option.icon}
                  selected={selectedOption === option.title}
                  onClick={() => handleOptionPress(option.title)}
                />
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <section className="mt-10 flex h-full flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl xl:text-4xl">
              Past Experiments{" "}
              <span className="">({experimentsQuery.data?.length || 0})</span>
            </h1>
            <article className="flex items-center space-x-4">
              <Select
                onValueChange={(e) => handleChooseCategory(e as Category)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(Category)
                    .sort((a, b) => a.localeCompare(b))
                    .map((category, index) => (
                      <SelectItem
                        value={category as Category}
                        key={index}
                        className="capitalize"
                      >
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <CircleOffIcon
                className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary"
                onClick={handleReset}
              />
            </article>
          </div>
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
                  />
                ),
                Error: () => (
                  <DefaultState
                    title="Error Loading Experiments"
                    icon={FileWarningIcon}
                    description="We're having trouble loading your experiments. Please try again later."
                    btnText="retry"
                    onClick={handleRefetch}
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
              containerStyle="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3 w-full items-start"
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
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
