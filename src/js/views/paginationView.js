import icons from '../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    const curPage = this._data.page;

    const totalPageBtn = `
        <button data-goto="${
          curPage === numPages ? 1 : numPages
        }" class="btn--inline pagination__btn--total-pages">
          <span>Page ${curPage} Of ${numPages}</span>
        </button>
    `;

    // If on page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return [this._generateMarkupButton('next', curPage), totalPageBtn].join(
        ''
      );
    }

    // If on last page
    if (curPage === numPages && numPages > 1) {
      return [this._generateMarkupButton('prev', curPage), totalPageBtn].join(
        ''
      );
    }

    // others
    if (curPage > 1) {
      return [
        this._generateMarkupButton('prev', curPage),
        totalPageBtn,
        this._generateMarkupButton('next', curPage),
      ].join('');
    }

    // If only one page
    return '';
  }

  _generateMarkupButton(action, curPage) {
    let goToPage;
    let arrowDir;
    if (action === 'next') {
      goToPage = curPage + 1;
      arrowDir = 'right';
    }
    if (action === 'prev') {
      goToPage = curPage - 1;
      arrowDir = 'left';
    }

    return `
        <button data-goto="${goToPage}" class="btn--inline pagination__btn--${action}">
            ${action === 'next' ? `<span>Page ${goToPage}</span>` : ''}
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-${arrowDir}"></use>
            </svg>
            ${action === 'prev' ? `<span>Page ${goToPage}</span>` : ''}
        </button>
      `;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
