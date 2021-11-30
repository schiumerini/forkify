import { API_URL, API_KEY } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  list: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}${API_KEY}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    //https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.list = data.data.recipes;
  } catch (err) {
    throw err;
  }
};
