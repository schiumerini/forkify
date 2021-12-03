import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/RecipeView.js';
import searchView from './views/SearchView.js';
import searchResultsView from './views/SearchResultsView.js';
import paginationView from './views/PaginationView.js';
import bookmarksView from './views/BookmarksView.js';
import addRecipeView from './views/AddRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// This is Parcel syntax NOT Javascript. TODO: find out how it works
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 1) Update results view to mark selected search result
    searchResultsView.update(model.getSearchResultsPage());

    // 2) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 3) Loading recipe
    await model.loadRecipe(id);

    // 4) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    searchResultsView.renderSpinner();

    // 2) Loading Search Results
    await model.loadSearchResults(query);

    // 3) Rendering Search Results
    searchResultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    searchView.renderError(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new results
  searchResultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) Update the recipe servings (in state)
  model.updateServings(newServings);
  // 2) Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render loading spinner
    addRecipeView.renderSpinner();

    // Update new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Update URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

// Improvement and feature ideas: Challenges
// 1) Display numPages between the pagination buttons.
// 2) Ability to sort search results by duration or numIngreds
// 3) Perform ingredient validation in view, before submitting the form.
// 4) Improve recipe ingredient input: separate in multiple fields and allow more than 6 ingreds.
// 5) Shopping list feature: button on recipe to add ingredients to a list.
// 6) Weekly meal plannin feature: assign recipes to the next 7 days and show on a weekly calendar.
// 7) Get nutrition data on each infred from Spoonacular API and calc the total calories of recipe.
