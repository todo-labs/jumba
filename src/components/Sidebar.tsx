import { useState, useMemo } from "react";
import { signIn, useSession } from "next-auth/react";
import { Ingredient } from "@prisma/client";

import RandomSVG from "public/random.svg";
import IngredientsDropdown from "./IngredientsDropdown";
import {
  MAX_INGREDIENTS,
  Requirements,
  getPrompt,
  MAX_NUM_OF_PEOPLE,
} from "~/constants";
import { api } from "~/utils/api";
import { useModal } from "~/utils/useModal";

interface ISidebarProps {
  choice: string | undefined;
  visible: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ choice, visible, setShowSidebar }: ISidebarProps) => {
  const [selectedIngredients, setSelectedIngredients] = useState<
    Partial<Ingredient>[]
  >([]);
  const [numOfPeople, setNumOfPeople] = useState<number>(1);
  const { setTitle, setMessage, setShowModal, Modal, setType } = useModal();
  const { data, isError, refetch } = api.ingredients.getRandom.useQuery();
  const createExperiment = api.experiments.create.useMutation({
    onError: (error) => {
      setTitle(error.data?.code);
      setType("error");
      setMessage(error.message);
      setShowModal(true);
    },
    onSuccess: (data) => {
      console.log(data)
      setSelectedIngredients([]);
      setNumOfPeople(1);
      setRequirements(
        Object.values(Requirements).map((requirement) => {
          return {
            label: requirement,
            checked: false,
          };
        })
      );
    },
  });
  const { data: session } = useSession();
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
    if (selectedIngredients.length >= MAX_INGREDIENTS) return;
    void refetch();
    if (isError) return;
    if (data) setSelectedIngredients([...selectedIngredients, data]);
  };

  const prompt = useMemo(() => {
    return getPrompt(
      selectedIngredients,
      choice!,
      requirements.filter((req) => req.checked).map((req) => req.label),
      numOfPeople
    );
  }, [selectedIngredients, choice, requirements, numOfPeople]);

  const handleGenerateExperiment = () => {
    createExperiment.mutate({
      ingredients: selectedIngredients.map((ingredient) => ingredient.id),
      category: choice!,
      requirements: requirements
        .filter((req) => req.checked)
        .map((req) => req.label),
      numOfPeople,
      prompt: prompt.map((p) => p.text).join(" "),
      tag: Math.floor(Math.random() * 1000),
    });
  };

  const loadingIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="24"
      height="24"
    >
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="#fff"
        stroke-width="10"
      >
        <animate
          attributeName="stroke-dasharray"
          from="0, 188.5"
          to="376.99, 188.5"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-188.5"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );

  if (!visible) return null;

  return (
    <>
      <section className="fixed right-0 z-50 h-screen w-full space-y-4 overflow-scroll bg-white p-4 shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] xl:z-0 lg:w-96">
        <div className="flex w-full items-center justify-between">
          <h1 className="flex items-center justify-center text-2xl">
            <span className="" onClick={() => setShowSidebar(false)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L11.83 13H20V11H11.83L15.41 7.41Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Ingredients
            <span className="ml-2 text-sm text-gray-400">
              {"("}
              <span className="font-medium text-primary-500">
                {selectedIngredients.length}
              </span>
              /{MAX_INGREDIENTS}
              {")"}
            </span>
          </h1>
          <button onClick={getRandom} disabled={!session}>
            <RandomSVG
              className={`h-8 w-8 ${
                selectedIngredients.length === MAX_INGREDIENTS || !session
                  ? "fill-gray-200"
                  : "fill-primary-400"
              }`}
            />
          </button>
        </div>
        <IngredientsDropdown
          selectedItems={selectedIngredients}
          setSelectedItems={setSelectedIngredients}
        />
        <section className="border-t-2">
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
        <section className="border-t-2">
          <h1 className="mt-2 mb-4 text-2xl">Prompt</h1>
          <div className="h-fit min-h-32 w-full overflow-x-scroll scroll-smooth rounded-lg border-2 border-gray-200 bg-gray-50 p-2 xl:h-32">
            {selectedIngredients.length > 1 &&
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
        {!session ? (
          <button
            onClick={signIn}
            className="w-full rounded-lg bg-primary-400 p-2 py-3 font-medium capitalize text-white"
          >
            Login
          </button>
        ) : (
          <button
            className={`w-full rounded-lg ${
              createExperiment.isLoading ? "bg-primary-600" : "bg-primary-400"
            } p-2 py-3 font-medium capitalize text-white disabled:bg-gray-300`}
            disabled={
              selectedIngredients.length < 2 ||
              selectedIngredients.length > MAX_INGREDIENTS ||
              requirements.every((req) => !req.checked) ||
              numOfPeople < 0
            }
            onClick={handleGenerateExperiment}
          >
            {createExperiment.isLoading ? (
              <span className="flex items-center justify-center">
                {loadingIcon}
              </span>
            ) : (
              <span>Generate</span>
            )}
          </button>
        )}
      </section>
      <Modal />
    </>
  );
};

export default Sidebar;
