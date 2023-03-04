import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import { Experiment as IExperiment } from "@prisma/client";

import { api } from "~/utils/api";
import Option from "~/components/Option";
import Experiment from "~/components/Experiment";
import Sidebar from "~/components/Sidebar";
import DefaultState from "~/components/DefaultState";
import { options } from "~/constants";

import WarningSVG from "public/warning.svg";
import ExperimentSVG from "public/experiment.svg";

const Home: NextPage = () => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const { data, isLoading, isError } = api.experiments.getAll.useQuery();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
    setShowSidebar(true);
  };

  return (
    <div className="relative flex h-screen min-h-full items-start justify-center overflow-y-hidden border">
      <Head>
        <title>Jumba</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar choice={selectedOption} visible={showSidebar} />
      <main className="flex w-full flex-1 flex-col p-10">
        <section className="flex w-full justify-between">
          <h1 className="text-4xl">
            Jumba
            <a className="text-orange-600" href="https://nextjs.org">
              .
            </a>
          </h1>
          <input
            className="h-10 w-1/3 rounded-lg border-2 border-gray-300 bg-slate-100 px-5 pr-16 text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Search past 'Experiments'"
          />
        </section>

        <section className="mt-10 flex w-full items-start justify-between">
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

        <section className="mt-10 flex min-h-screen flex-col">
          <h1 className="text-4xl">
            Past Experiments {" "}
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
                btnText=""
                onClick={() => console.log("clicked")}
              />
            ) : data.length > 0 ? (
              data?.map((experiment: IExperiment, index: number) => (
                <Experiment
                  key={index}
                  id={experiment.id}
                  title={experiment.title}
                  img={experiment.img}
                  tag={experiment.tag}
                />
              ))
            ) : (
              <DefaultState
                title="No Experiments Yet"
                icon={ExperimentSVG}
                description="It seems that no one has uploaded any experiments yet. Be the first one to share your findings with the community!"
                btnText="Create"
                onClick={() => console.log("clicked")}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
