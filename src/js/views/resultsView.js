import View from './view.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';

  _generateMarkup() {
    const markup = this._data
      .map(result => previewView.render(result, false))
      .join('');
    return markup;
  }
}

export default new ResultsView();
