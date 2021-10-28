class SearchView {
  #query;
  #parentEL = document.querySelector('.search');
  #searchField = this.#parentEL.querySelector('.search__field');

  addHandlerSearch(handler) {
    this.#parentEL.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  #clearInput() {
    this.#searchField.value = '';
  }

  getQuery() {
    this.#query = this.#searchField.value;
    this.#clearInput();
    return this.#query;
  }
}

export default new SearchView();
