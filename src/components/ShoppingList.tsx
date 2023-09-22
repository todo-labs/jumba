import { Experiment, Ingredient } from "@prisma/client";

import Option from "./cards/Option";

const ShoppingList = ({
  ingredients,
  shoppingList,
  handleItemSelected,
}: {
  ingredients: Ingredient[] | undefined;
  shoppingList: Ingredient[];
  handleItemSelected: (ingredient: Ingredient) => void;
}) => {
  return (
    <section>
      <h1 className="my-6 text-3xl font-semibold tracking-tight">
        Shopping List
      </h1>
      <div className="flex overflow-hidden overflow-x-scroll">
        {ingredients
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((ingredient, index) => (
            <Option
              key={index}
              title={ingredient.name}
              icon={ingredient.icon}
              onClick={() => handleItemSelected(ingredient)}
              selected={
                !!shoppingList.find((item) => item.name === ingredient.name)
              }
            />
          ))}
      </div>
    </section>
  );
};

export default ShoppingList;
