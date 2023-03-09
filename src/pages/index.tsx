import { type NextPage } from "next";
import { useState, useMemo } from "react";
import Head from "next/head";
import { Experiment as IExperiment } from "@prisma/client";

import Option from "~/components/Option";
import Experiment from "~/components/Experiment";
import Sidebar from "~/components/Sidebar";
import DefaultState from "~/components/DefaultState";

import { api } from "~/utils/api";
import { options } from "~/constants";

import WarningSVG from "public/warning.svg";
import ExperimentSVG from "public/experiment.svg";

const Home: NextPage = () => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const { data, isLoading, isError, refetch } = api.experiments.getAll.useQuery();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
    setShowSidebar(true);
  };

  const filterExperiments = useMemo<IExperiment[]>(() => {
    if (!selectedOption) {
      return data;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data?.filter((experiment: IExperiment) => {
      return (
        experiment.title.includes(search) ||
        experiment.tag.toString().includes(search) ||
        experiment.ingredients.filter((ingredient) =>
          ingredient.includes(search)
        ).length > 0
      );
    });
  }, [data, selectedOption, search]);

  return (
    <div className="relative flex h-screen min-h-full items-start justify-center overflow-y-hidden border">
      <Head>
        <title>Jumba</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar choice={selectedOption} visible={showSidebar} />
      <main className="flex w-full flex-1 flex-col p-10">
        <section
          className="flex w-full justify-between"
          onClick={() => setShowSidebar(false)}
        >
          <h1 className="text-4xl">
            Jumba
            <a className="text-primary-600" href="https://nextjs.org">
              .
            </a>
          </h1>
          <input
            className="h-10 w-1/3 rounded-lg border-2 border-gray-300 bg-slate-100 px-5 pr-16 text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search past 'Experiments'"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        <section className="mt-10 flex w-full flex-wrap">
          {options.map((option, index) => (
            <Option
              key={index}
              title={option.title}
              icon={option.icon}
              selected={selectedOption === option.title}
              onClick={() => handleOptionPress(option.title)}
            />
          ))}
        </section>

        <section
          className="mt-10 flex min-h-screen flex-col"
          onClick={() => setShowSidebar(false)}
        >
          <h1 className="text-4xl">
            Past Experiments{" "}
            {!isError && !isLoading && (
              <span className="">({data.length})</span>
            )}
          </h1>
          <div className="mt-10 flex flex-row space-x-6">
            {isLoading ? (
              <DefaultState
                title="Loading Experiments..."
                description="We're working on getting all the experiments uploaded by people."
                btnText=""
                onClick={() => console.log("clicked")}
              />
            ) : isError ? (
              <DefaultState
                title="Error Loading Experiments"
                icon={WarningSVG}
                description="We're working on getting all the experiments uploaded by people."
                btnText="retry"
                onClick={() => refetch()}
              />
            ) : filterExperiments.length > 0 ? (
              filterExperiments?.map(
                (experiment: IExperiment, index: number) => (
                  <Experiment
                    key={index}
                    id={experiment.id}
                    title={experiment.title}
                    img={experiment.img}
                    tag={experiment.tag}
                  />
                )
              )
            ) : (
              <DefaultState
                title="No Experiments Yet"
                icon={ExperimentSVG}
                description="It seems that no one has uploaded any experiments yet. Be the first one to share your findings with the community!"
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
