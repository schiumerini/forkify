import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import searchView from './views/SearchView.js';
import searchResultsView from './views/SearchResultsView.js';
import paginationView from './views/PaginationView.js';
import bookmarksView from './views/BookmarksView.js';

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

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
