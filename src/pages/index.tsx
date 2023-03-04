import { type NextPage } from "next";
import { useState } from "react";
import Head from "next/head";

import { api } from "~/utils/api";
import Option from "~/components/Option";
import Experiment from "~/components/Experiment";
import Sidebar from "~/components/Sidebar";
import { options } from "~/constants";
import { Experiment as IExperiment } from "@prisma/client";

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

        <section className="mt-10 flex w-full items-start justify-evenly">
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
          <h1 className="text-4xl">Past Experiments ({data?.length})</h1>
          <div className="mt-10 flex flex-row space-x-6">
            {isLoading ? (
              <div className="flex items-center">
                <h1 className="text-2xl">Loading...</h1>
              </div>
            ) : isError ? (
              <div>Error</div>
            ) : (
              data?.map((experiment: IExperiment, index: number) => (
                <Experiment
                  key={index}
                  id={experiment.id}
                  title={experiment.title}
                  img={experiment.img}
                  tag={experiment.tag}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
