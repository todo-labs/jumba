import { useState } from "react";

import RandomSVG from "public/random.svg";
import Slider from "./Slider";
import IngredientsDropdown from "./IngredientsDropdown";
import { MAX_INGREDIENTS } from "~/constants";
import { api } from "~/utils/api";

interface ISidebarProps {
  choice: string | undefined;
  visible: boolean;
}

enum Requirements {
  QUICK = "Quick",
  FANCY = "Fancy",
}

const Sidebar = ({ choice, visible }: ISidebarProps) => {
  const { data, isError, refetch } = api.metadata.getRandom.useQuery();

  const [requirements, setRequirements] = useState<
    {
      label: string;
      checked: boolean;
    }[]
  >(
    Object.values(Requirements).map((val) => {
      return {
        label: val,
        checked: false,
      };
    })
  );

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [numOfPeople, setNumOfPeople] = useState<number>(1);

  const handleSelectOption = (requirement: any) => {
    const newRequirements = requirements.map((req) => {
      if (req.label === requirement.label) {
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

  if (!visible) return null;

  return (
    <nav
      id="sidenav-2"
      className="fixed top-0 right-0 z-[1035] h-screen w-96 -translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0"
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
              <span className="text-orange-500">{selectedItems.length}</span>/
              {MAX_INGREDIENTS}
              {")"}
            </span>
          </h1>
          <button onClick={getRandom}>
            <RandomSVG className="h-8 w-8 fill-orange-400" />
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
                    className="form-checkbox rounded-md border-none bg-gray-300 checked:border-2 checked:border-white checked:bg-orange-600"
                    onChange={() => handleSelectOption(requirement)}
                  />
                  <label className="ml-4">{requirement.label}</label>
                </li>
              );
            })}
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={numOfPeople}
                onChange={(e) => setNumOfPeople(Number(e.target.value))}
                className="h-8 w-full cursor-pointer"
              />
              <label className="ml-auto font-medium">{numOfPeople} People</label>
            </div>
          </ul>
        </section>
        <section className="h-1/3 border-t-2">
          <h1 className="mt-2 mb-4 text-2xl">Prompt</h1>
          <textarea
            className="h-32 w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-2"
            placeholder="What are you craving?"
            readOnly
          />
        </section>
        <button
          className="w-full rounded-lg bg-orange-400 p-2 py-3 font-medium capitalize text-white disabled:bg-gray-300"
          disabled={
            selectedItems.length < 2 ||
            selectedItems.length > MAX_INGREDIENTS ||
            requirements.every((req) => !req.checked) ||
            numOfPeople < 0
          }
        >
          Generate new Experiment
        </button>
      </section>
    </nav>
  );
};

export default Sidebar;
