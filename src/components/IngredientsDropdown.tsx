import React, { useState } from "react";
import { api } from "~/utils/api";
import DefaultState from "./DefaultState";

import { MAX_INGREDIENTS } from "~/constants";

interface IIngredientsDropdownProps {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const IngredientsDropdown: React.FC<IIngredientsDropdownProps> = ({
  selectedItems,
  setSelectedItems,
}: IIngredientsDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = api.metadata.getAll.useQuery({
    query: searchTerm,
  });

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (selectedItems.length >= MAX_INGREDIENTS) return;
    setSearchTerm(event.target.value);
  };

  const handleItemSelect = (item: string) => {
    if (selectedItems.length >= MAX_INGREDIENTS) return;
    setSelectedItems([...selectedItems, item]);
    setSearchTerm("");
  };

  const handleChipDelete = (item: string) => {
    setSelectedItems(
      selectedItems.filter((selectedItem) => selectedItem !== item)
    );
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="w-full rounded-lg bg-gray-100 p-2"
      />
      {searchTerm.length > 0 && (
        <ul className="absolute h-64 max-h-64 w-full overflow-auto border border-gray-400 bg-white shadow-lg">
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
            data.map((item: string, index: number) => (
              <li
                key={index}
                className="cursor-pointer p-2 capitalize hover:bg-gray-200"
                onClick={() => handleItemSelect(item)}
              >
                {item}
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
      )}
      <div className="mt-2 flex flex-wrap">
        {selectedItems.map((item, index) => (
          <div
            key={index}
            className="mr-2 mb-2 rounded-lg border-2 border-orange-600 bg-orange-200 px-3 py-1 text-xs capitalize text-orange-700"
          >
            {item}
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
    </div>
  );
};

export default IngredientsDropdown;
