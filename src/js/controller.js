import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/AddRecipeView.js';

import 'regenerator-runtime/runtime';
import 'core-js/stable';

const { async } = require('q');

const controlRecipe = async function () {
  try {
    // Get id from the url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render the spinner
    recipeView.renderSpinner();

    // Update the results to give the active class to the selected result
    resultsView.update(model.getResultsPage());

    // Update the bookmarks
    bookmarksView.update(model.state.bookmarks);

    // load the recipe from the API
    await model.loadRecipe(id);
    const recipe = model.state.recipe;

    // render the recipe
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchRecipes = async function () {
  // Get the query from the search field in the DOM
  const query = searchView.getQuery();
  if (!query) return;

  // render the spinner
  resultsView.renderSpinner();

  // Search the recipes with the given query
  await model.searchRecipe(query);

  // Render the recipes
  resultsView.render(model.getResultsPage());

  // Render the intial pagination
  paginationView.render(model.state.search);
};

const paginationController = function (goToPage) {
  // Render NEW the recipes
  resultsView.render(model.getResultsPage(goToPage));

  // Render the NEW pagination
  paginationView.render(model.state.search);
};

const servingsController = function (newServings) {
  // Update the servings in the model
  model.updateServings(newServings);

  // Re render the recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove bookmark from state
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe in the DOM
  recipeView.update(model.state.recipe);

  // Render the bookmarks in the bookmarks list
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    const recipeData = await model.addRecipe(data);
  } catch (err) {
    AddRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerNewServings(servingsController);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerClick(paginationController);
  AddRecipeView.addHandlerSubmitRecipe(controlAddRecipe);
};

init();
