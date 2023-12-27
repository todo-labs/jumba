import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import type { IExperiment } from "types";
import Link from "next/link";
import type { Category } from "@prisma/client";
import { ChefHatIcon, FileWarningIcon, Loader2Icon } from "lucide-react";

import Option from "@/components/cards/Option";
import ExperimentCard from "@/components/cards/Experiment";
import DefaultState from "@/components/DefaultState";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserNav } from "@/components/user/Nav";
import QueryWrapper from "@/components/QueryWrapper";
import CreateExperimentModal from "@/components/modals/CreateExperimentModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { api } from "@/utils/api";
import { options } from "@/utils/constants";
import { Separator } from "@/components/ui/Separator";
import { useMixpanel } from "@/lib/mixpanel";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";

const Home: NextPage = () => {
  const [selectedOption, setSelectedOption] = useState<Category>();
  const [selection, setSelection] = useState<Category | undefined>(undefined);
  const experimentsQuery = api.experiments.getAll.useQuery({
    category: selection,
  });
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const { trackEvent } = useMixpanel();

  const handleOptionPress = (option: Category) => {
    setSelectedOption(option);
    setShowSidebar(true);
    trackEvent("ButtonClick", {
      value: option,
      label: "Create Experiment",
    });
  };

  const handleFilterSelection = (option: Category) => {
    setSelection(option);
    trackEvent("ButtonClick", {
      value: option,
      label: "Filter Experiments",
    });
  };

  const handleOnClose = () => {
    setSelectedOption(undefined);
    setShowSidebar(false);
    trackEvent("ButtonClick", {
      label: "Close Create Experiment Modal",
    });
  };

  const handleRefetch = () => {
    void experimentsQuery.refetch();
    trackEvent("ButtonClick", {
      label: "Refetch Experiments",
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

        <section className="mt-10 flex overflow-hidden overflow-x-scroll">
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
          {/* <ScrollBar orientation="horizontal" className="mt-2" /> */}
        </section>

        <section className="mt-10 flex h-full flex-col">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl xl:text-4xl">
              Past Experiments{" "}
              <span className="">({experimentsQuery.data?.length || 0})</span>
            </h1>
            <Select onValueChange={(item) => setSelection(item as Category)}>
              <SelectTrigger className="max-w-72">
                <SelectValue>{selection || "All"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={""} onClick={() => setSelection(undefined)}>
                  All
                </SelectItem>
                {options.map((option, index) => (
                  <SelectItem
                    key={index}
                    value={option.title}
                    onClick={() => handleFilterSelection(option.title)}
                  >
                    {option.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
        <SheetContent>
          <SheetHeader className="pb-4 text-left">
            <SheetTitle>
              New{" "}
              <span className="capitalize text-primary">
                {selectedOption?.toLowerCase()}
              </span>{" "}
              Experiment
            </SheetTitle>
            <SheetDescription>
              Pick all the options needed to create your new experiment.
            </SheetDescription>
          </SheetHeader>
          <Separator className="mb-8" />
          <CreateExperimentModal
            category={selectedOption as Category}
            onClose={handleOnClose}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Home;
