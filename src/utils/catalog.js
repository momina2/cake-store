import { cakes as defaultCakes } from "../data/cakes";
import { categories as defaultCategories } from "../data/categories";

export const getCustomerCategories = () => {
  try {
    const saved = localStorage.getItem("cakeCategories");

    const categories = saved
      ? JSON.parse(saved)
      : defaultCategories;

    return categories.filter(
      (category) =>
        !category.status ||
        category.status === "Active"
    );
  } catch (error) {
    console.error(
      "Error loading categories:",
      error
    );

    return defaultCategories;
  }
};

export const getCustomerCakes = () => {
  try {
    const saved = localStorage.getItem("adminCakes");

    const cakes = saved
      ? JSON.parse(saved)
      : defaultCakes;

    return cakes.filter(
      (cake) =>
        !cake.status ||
        cake.status === "Active"
    );
  } catch (error) {
    console.error(
      "Error loading cakes:",
      error
    );

    return defaultCakes;
  }
};

export const getFeaturedCakes = () => {
  return getCustomerCakes().filter(
    (cake) => cake.featured
  );
};

export const getCakeById = (id) => {
  return getCustomerCakes().find(
    (cake) => String(cake.id) === String(id)
  );
};