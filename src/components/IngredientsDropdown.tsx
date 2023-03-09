import React, { useState, useMemo } from "react";

import { api } from "~/utils/api";
import { useDebounce } from "~/utils/useDebounce";
import DefaultState from "./DefaultState";

import { MAX_INGREDIENTS } from "~/constants";
import { Ingredient } from "@prisma/client";

interface IIngredientsDropdownProps {
  selectedItems: Ingredient[];
  setSelectedItems: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const IngredientsDropdown: React.FC<IIngredientsDropdownProps> = ({
  selectedItems,
  setSelectedItems,
}: IIngredientsDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 100);

  const { data, isLoading, isError } = api.ingredients.getAll.useQuery({
    query: debouncedSearchTerm,
  });

  const addIngredient = api.ingredients.add.useMutation();

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (selectedItems.length >= MAX_INGREDIENTS) return;
    setSearchTerm(event.target.value);
    setShowDropdown(true);
  };

  const handleItemSelect = (item: Ingredient) => {
    if (selectedItems.length >= MAX_INGREDIENTS) return;
    setSelectedItems([...selectedItems, item]);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleChipDelete = (item: Ingredient) => {
    const newItems = selectedItems.filter((i) => i.name !== item.name);
    setSelectedItems(newItems);
  };

  const handleAddIngredient = () => {
    addIngredient.mutate({
      name: searchTerm,
    });
    setSelectedItems([...selectedItems, searchTerm]);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const displayItems = useMemo(() => {
    return selectedItems.sort((a, b) => a.name.length - b.name.length);
  }, [selectedItems]);

  return (
    <section className=" space-y-4">
      <div className="mt-2 flex w-full flex-wrap">
        {displayItems.map((item: Ingredient) => (
          <div
            key={item.id}
            className="mr-2 mb-2 rounded-lg border-2 border-primary-600 bg-primary-200 px-3 py-1 text-xs capitalize text-primary-700"
          >
            {item.name}
            <button
              type="button"
              className="ml-2 p-0"
              onClick={() => handleChipDelete(item)}
            >
              x
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="w-full rounded-lg bg-gray-100 p-2"
      />
      {showDropdown && (
        <div className="rounded-lg bg-gray-100">
          <ul className="max-h-60 overflow-scroll p-3">
            {isLoading && !data ? (
              <DefaultState
                title="Loading..."
                description="Please wait while we load the data"
                size="sm"
              />
            ) : isError ? (
              <DefaultState
                title="Error"
                description="There was an error loading the data"
                size="sm"
              />
            ) : data.length > 0 ? (
              data.map((item: Ingredient, index: number) => (
                <li
                  key={index}
                  className="cursor-pointer p-2 capitalize hover:bg-primary-200"
                  onClick={() => handleItemSelect(item)}
                >
                  {item?.name}
                </li>
              ))
            ) : (
              <DefaultState
                title="No results 😅"
                description="Sorry, we couldn't find any ingredients matching your search term. Please try again with a different search term."
                size="sm"
              />
            )}
          </ul>
          {data?.length === 0 && (
            <button
              className="bottom-0 h-12 w-full rounded-b-lg bg-primary-500 font-medium text-white"
              type="button"
              onClick={handleAddIngredient}
            >
              Add Ingredient
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default IngredientsDropdown;
