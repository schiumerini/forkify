import icons from 'url:../../img/icons.svg';
import View from './View.js';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'We could not find any recipe. Please try another search!';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(res => this._generateMarkupPreview(res)).join('');
  }

  _generateMarkupPreview(result) {
    return `
      <li class="preview">
        <a class="preview__link preview__link" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title.slice(0, 24) + '...'}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            <!-- 
            <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
            -->
          </div>
        </a>
      </li>
    `;
  }
}

export default new SearchResultsView();
