import { useState, useMemo, useEffect } from "react";

import RandomSVG from "public/random.svg";
import IngredientsDropdown from "./IngredientsDropdown";
import {
  MAX_INGREDIENTS,
  Requirements,
  getPrompt,
  MAX_NUM_OF_PEOPLE,
} from "~/constants";
import { api } from "~/utils/api";

interface ISidebarProps {
  choice: string | undefined;
  visible: boolean;
}

const Sidebar = ({ choice, visible }: ISidebarProps) => {
  const { data, isError, refetch } = api.ingredients.getRandom.useQuery();
  const createExperiment = api.experiments.create.useMutation();

  const [requirements, setRequirements] = useState<
    {
      label: Requirements;
      checked: boolean;
    }[]
  >(
    Object.values(Requirements).map((requirement) => {
      return {
        label: requirement,
        checked: false,
      };
    })
  );

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [numOfPeople, setNumOfPeople] = useState<number>(1);

  const handleSelectOption = (requirement: Requirements) => {
    const newRequirements = requirements.map((req) => {
      if (req.label === requirement) {
        return {
          ...req,
          checked: !req.checked,
        };
      }
      return req;
    });
    setRequirements(newRequirements);
  };

  const getRandom = () => {
    void refetch();
    if (isError) return;
    if (selectedItems.length >= MAX_INGREDIENTS) return;
    if (data) setSelectedItems([...selectedItems, data]);
  };

  const prompt = useMemo(() => {
    return getPrompt(
      selectedItems,
      choice!,
      requirements.filter((req) => req.checked).map((req) => req.label),
      numOfPeople
    );
  }, [selectedItems, choice, requirements, numOfPeople]);

  const handleGenerateExperiment = async () => {
    await createExperiment.mutateAsync({
      ingredients: selectedItems,
      category: choice!,
      requirements: requirements
        .filter((req) => req.checked)
        .map((req) => req.label),
      numOfPeople,
      prompt: prompt.map((p) => p.text).join(" "),
      tag: Math.floor(Math.random() * 1000),
    });
  };

  if (!visible) return null;

  return (
    <nav
      id="sidenav-2"
      className="fixed top-0 right-0 z-[1035] h-screen w-96 -translate-x-full overflow-scroll bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0"
      data-te-sidenav-init
      data-te-sidenav-hidden="false"
      data-te-sidenav-mode="side"
      data-te-sidenav-content="#content"
    >
      <section className="space-y-4 p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">
            Ingredients
            <span className="ml-2 text-sm text-gray-400">
              {"("}
              <span className="text-primary-500 font-medium">{selectedItems.length}</span>/
              {MAX_INGREDIENTS}
              {")"}
            </span>
          </h1>
          <button onClick={getRandom}>
            <RandomSVG
              className={`h-8 w-8 ${
                selectedItems.length === MAX_INGREDIENTS
                  ? "fill-gray-200"
                  : "fill-primary-400"
              }`}
            />
          </button>
        </div>
        <IngredientsDropdown
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        <section className="h-1/3 border-t-2">
          <h1 className="mt-2 mb-4 text-2xl">Requirements</h1>
          <ul>
            {requirements.map((requirement, index) => {
              return (
                <li key={index}>
                  <input
                    type="checkbox"
                    value={requirement.label}
                    className="form-checkbox rounded-md border-none bg-gray-300 checked:border-2 checked:border-white checked:bg-primary-600"
                    onChange={() => handleSelectOption(requirement.label)}
                  />
                  <label className="ml-4">{requirement.label}</label>
                </li>
              );
            })}
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={MAX_NUM_OF_PEOPLE}
                step={0.5}
                value={numOfPeople}
                onChange={(e) => setNumOfPeople(Number(e.target.value))}
                className="h-8 w-full cursor-pointer"
              />
              <label className="ml-auto font-medium">
                {numOfPeople} {numOfPeople === 1 ? " person" : " people"}
              </label>
            </div>
          </ul>
        </section>
        <section className="h-1/3 border-t-2">
          <h1 className="mt-2 mb-4 text-2xl">Prompt</h1>
          <div className="h-32 w-full overflow-x-scroll scroll-smooth rounded-lg border-2 border-gray-200 bg-gray-50 p-2">
            {selectedItems.length > 1 &&
              prompt.map((item, index) => {
                return (
                  <span
                    key={index}
                    className={
                      item.highlighted
                        ? "font-medium text-primary-600"
                        : "text-gray-400"
                    }
                  >
                    {item.text}
                  </span>
                );
              })}
          </div>
        </section>
        <button
          className="w-full rounded-lg bg-primary-400 p-2 py-3 font-medium capitalize text-white disabled:bg-gray-300"
          disabled={
            selectedItems.length < 2 ||
            selectedItems.length > MAX_INGREDIENTS ||
            requirements.every((req) => !req.checked) ||
            numOfPeople < 0
          }
          onClick={() => handleGenerateExperiment()}
        >
          Generate new Experiment
        </button>
      </section>
    </nav>
  );
};

export default Sidebar;
