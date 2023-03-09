const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const experiments = [
  {
    title: "Veggie Tacos",
    tag: 1,
    category: "Mexican",
    prompt:
      "I want to make a healthy and delicious meal using these ingredients.",
    img: "https://plus.unsplash.com/premium_photo-1663853051487-59a6b639aff1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    steps: [
      "Warm the tortillas in a pan",
      "Assemble the tacos with the ingredients",
    ],
    ingredients: [
      {
        name: "Tortillas",
      },
      {
        name: "Lettuce",
      },
      {
        name: "Tomatoes",
      },
      {
        name: "Onions",
      },
      {
        name: "Avocado",
      },
      {
        name: "Cilantro",
      },
      {
        name: "Lime",
      },
      {
        name: "Salsa",
      },
    ],
    duration: 20,
    feeds: 2,
    createdById: "1",
  },
  {
    title: "BBQ Ribs",
    tag: 2,
    category: "American",
    prompt: "I want to make a barbeque dish using these ingredients.",
    img: "https://images.unsplash.com/photo-1560024818-2c6d122cfbe2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
    steps: [
      "Marinate the ribs in bbq sauce and spices",
      "Grill the ribs until they are cooked through",
    ],
    duration: 45,
    feeds: 3,
    createdById: "1",
  },
  {
    title: "Spaghetti Bolognese",
    tag: 3,
    category: "Italian",
    prompt: "I need a quick and filling meal using these ingredients.",
    img: "https://images.unsplash.com/photo-1589227365533-cee630bd59bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    steps: [
      "Cook the spaghetti according to package instructions",
      "Brown the ground beef in a pan",
      "Add the tomato sauce and spices to the pan and let simmer for 10 minutes",
    ],
    feeds: 1,
    ingredients: [
      {
        name: "Spaghetti",
      },
      {
        name: "Ground Beef",
      },
      {
        name: "Tomato Sauce",
      },
      {
        name: "Salt",
      },
      {
        name: "Pepper",
      },
    ],
    duration: 30,
    createdById: "1",
  },
];

async function main() {
  for (const experiment of experiments) {
    try {
      await prisma.experiment.create({
        data: experiment,
      });
    } catch (e) {
      console.log(e);
    }
  }
  const response = await fetch(
    "https://gist.githubusercontent.com/ConceptCodes/cda94d317fe3140ba860839dbcb71ed8/raw/08e3cf7a155f15d87db22fd1184c3efc9bad623f/all_recipies_ingredients.txt"
  );
  const data = await response.text();
  const ingredients = data.split("\n").map((x) => {
    return { name: x.trim().replace('"', "") };
  });
  await prisma.ingredient.createMany({ data: ingredients });
  await prisma.$disconnect();
  console.log(`Added ${ingredients.length} ingredients to the database`);
  console.log("Seeded the database");
}

main();
