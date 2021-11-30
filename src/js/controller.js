import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import searchView from './views/SearchView.js';
import searchResultsView from './views/SearchResultsView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// This is Parcel syntax NOT Javascript. TODO: find out how it works
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    searchResultsView.renderSpinner();

    // 1) Loading Search Results
    await model.loadSearchResults(query);

    // 2) Rendering Search Results
    searchResultsView.render(model.state.search.results);
  } catch (err) {
    searchView.renderError(err);
  }
};
controlSearchResults();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerRender(controlSearchResults);
};

init();
