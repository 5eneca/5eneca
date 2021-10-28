import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
import { RES_PER_PAGE } from './config.js';

export const state = {
  recipe: {},

  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },

  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const { data } = await getJSON(`${API_URL}${id}`);
    // console.log(data);

    state.recipe = {
      imageUrl: data.recipe.image_url,
      ingredients: data.recipe.ingredients,
      cookingTime: data.recipe.cooking_time,
      publisher: data.recipe.publisher,
      sourceUrl: data.recipe.source_url,
      servings: data.recipe.servings,
      title: data.recipe.title,
      id: data.recipe.id,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const searchRecipe = async function (query) {
  try {
    state.search.query = query;

    const { data } = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.recipes.map(recipe => {
      return {
        publisher: recipe.publisher,
        imageUrl: recipe.image_url,
        title: recipe.title,
        id: recipe.id,
      };
    });

    // Reset the Current Page to 1
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * 10; // 0
  const end = page * 10; // 10

  // the slice method doesn't include the last one so it will bicome 0 to 9 (10)
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });

  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // Add the bookmark to the bookmarks array
  state.bookmarks.push(recipe);

  // Set the bookmarked property on the recipe
  state.recipe.bookmarked = true;

  // Save it to the local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //  Find the index of the bookmarked recipe
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);

  // remove the recipe from the bookmarks array
  state.bookmarks.splice(index, 1);

  // set the bookmarked value on the recipe to false
  state.recipe.bookmarked = false;

  // Save it to the local storage
  persistBookmarks();
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = JSON.parse(window.localStorage.getItem('bookmarks'));
  if (storage) state.bookmarks = storage;
};

init();

export const addRecipe = async function (recipeData) {
  try {
    const dataArr = Object.entries(recipeData);
    const ingredientsArr = dataArr
      .filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map(ing => {
        return ing[1].replaceAll(' ', '').split(',');
      });

    const ingredients = ingredientsArr.map(ing => {
      if (ing.length !== 3) {
        throw new Error(
          'Please input the ingredients according to the specified format (:'
        );
      }

      const [quantity, unit, description] = ing;
      return {
        quantity,
        unit,
        description,
      };
    });

    const recipe = {
      title: recipeData.title,
      image_url: recipeData.image,
      publisher: recipeData.publisher,
      source_url: recipeData.sourceUrl,
      cooking_time: recipeData.cookingTime,
      servings: recipeData.servings,
      ingredients,
    };

    // const data = await sendJSON(API_URL);
    // console.log(recipe);
    const data = await sendJSON(API_URL, recipe);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
