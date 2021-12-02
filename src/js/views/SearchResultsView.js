import View from './View.js';
import icons from 'url:../../img/icons.svg';
import PreviewView from './PreviewView.js';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'We could not find any recipe. Please try another search!';

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new SearchResultsView();
