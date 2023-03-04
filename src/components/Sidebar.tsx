import { useState } from "react";
import Toggle from "./Toggle";
import Slider from "./Slider";
import { api } from "~/utils/api";

interface ISidebarProps {
  choice: string | undefined;
  visible: boolean;
}

enum Requirements {
  LESS_THAN_5_INGREDIENTS = "Less than 5 ingredients",
  QUICK = "Quick",
  VEGETARIAN = "Vegetarian",
}

const Sidebar = ({ choice, visible }: ISidebarProps) => {
  const {
    data: ingredients,
    isLoading,
    isError,
  } = api.metadata.getAll.useQuery();

  const [requirements, setRequirements] = useState<
    {
      label: string;
      checked: boolean;
    }[]
  >([]);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const localRequirements = Object.keys(Requirements).map((key) => {
    return {
      label: key,
      checked: false,
    };
  });

  const getRandomIngredient = () => {
    const randomIndex = Math.floor(Math.random() * ingredients?.length);
    return ingredients[randomIndex];
  };

  const handleChange = (requirement: any) => {
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
      <div className="flex justify-between">
        <h1 className="text-2xl font-medium mt-10 ml-10">Ingredients</h1>
      </div>
    </nav>
  );
};

export default Sidebar;
