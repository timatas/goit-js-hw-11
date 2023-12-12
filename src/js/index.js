import Notiflix from 'notiflix';
import { selectMarkup } from './markup';
import { galleryPhoto } from './pixabay';

const gallery = document.querySelector('.gallery');
export { gallery };
const searchForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const header = document.querySelector('.header');
const input = document.querySelector('.input');

const perPage = 40;
let page = 1;
let keyOfSearchPhoto = '';
let lastScrollTop = 0;
let scrollDirection = '';

function handleHeaderScroll() {
  window.addEventListener('scroll', () => {
    const currentScroll =
      window.window.scrollY || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      if (scrollDirection !== 'down') {
        scrollDirection = 'down';
        header.classList.add('hidden');
        input.classList.add('hidden');
        searchForm.classList.add('hidden');
      }
    } else {
      if (scrollDirection !== 'up') {
        scrollDirection = 'up';
        header.classList.remove('hidden');
        input.classList.remove('hidden');
        searchForm.classList.remove('hidden');
      }
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}
handleHeaderScroll();

btnLoadMore.classList.add('is-hidden');

searchForm.addEventListener('submit', onSearch);
function onSearch(evt) {
  evt.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  const { searchQuery } = evt.currentTarget.elements;
  keyOfSearchPhoto = searchQuery.value.trim().toLowerCase();

  if (keyOfSearchPhoto === '') {
    Notiflix.Notify.info('There isn`t data for search');
    return;
  }

  galleryPhoto(keyOfSearchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your request. Please try again'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
        selectMarkup(searchResults);
      }
      if (data.totalHits > perPage) {
        btnLoadMore.classList.remove('is-hidden');
        window.addEventListener('scroll', onInfiniteScroll);
      }
    })
    .catch(onFetchError);

  btnLoadMore.addEventListener('click', onLoadMoreClick);

  evt.currentTarget.reset();
}

function onLoadMoreClick() {
  page += 1;
  galleryPhoto(keyOfSearchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      const numberOfLastPage = Math.ceil(data.totalHits / perPage);

      selectMarkup(searchResults);
      if (page === numberOfLastPage) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.info(
          'We`re soory, but you`ve reached the end of search results.'
        );
        btnLoadMore.removeEventListener('click', onLoadMoreClick);
        window.removeEventListener('scroll', onInfiniteScroll);
      }
    })
    .catch(onFetchError);
}

function onFetchError() {
  Notiflix.Notify.failure('Please, try again.');
}
function onInfiniteScroll() {
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight
  ) {
    onLoadMoreClick();
  }
}
