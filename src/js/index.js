import Notiflix from 'notiflix';
import { handleHeaderScroll } from './scroll';
import { selectMarkup } from './markup';
import { getPhoto } from './pixabay';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
export { gallery, header, input, searchForm };
const searchForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const header = document.querySelector('.header');
const input = document.querySelector('.input');
const lightbox = new SimpleLightbox('.gallery a', {
  captionPosition: 'bottom',
  captionDelay: 250,
});

const perPage = 40;
let page = 1;
let keyOfSearchPhoto = '';

btnLoadMore.classList.add('is-hidden');
handleHeaderScroll();

searchForm.addEventListener('submit', onSearch);

btnLoadMore.addEventListener('click', onLoadMoreClick);
input.addEventListener('keydown', onKeydown);

async function onSearch(evt) {
  evt.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  const inputQuery = input.value.trim().toLowerCase();

  if (inputQuery === '') {
    Notiflix.Notify.info('There isn`t data for search');
    btnLoadMore.classList.add('is-hidden');
    return;
  }

  try {
    await galleryPhoto(inputQuery, page, perPage);
    input.value = ' ';
    keyOfSearchPhoto = inputQuery;
    btnLoadMore.classList.remove('is-hidden');
  } catch (error) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    btnLoadMore.classList.add('is-hidden');
  }
}

async function onLoadMoreClick() {
  page += 1;

  try {
    await galleryPhoto(keyOfSearchPhoto, page, perPage);
  } catch (error) {
    Notiflix.Notify.info('There isn`t data for search');
  }
}

async function onKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    page = 1;
    gallery.innerHTML = '';
    const inputQuery = input.value.trim().toLowerCase();

    if (inputQuery === '') {
      Notiflix.Notify.info('There isn`t data for search');
      return;
    }

    try {
      await galleryPhoto(inputQuery, page, perPage);
      input.value = '';
      keyOfSearchPhoto = inputQuery;
    } catch (error) {
      return error;
    }
  }
}

async function galleryPhoto(keyOfSearchPhoto, page, perPage) {
  const data = await getPhoto(keyOfSearchPhoto, page, perPage);

  if (data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your request. Please try again'
    );
    gallery.innerHTML = '';
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);

  selectMarkup(data.hits, gallery);
  lightbox.refresh();
  btnLoadMore.classList.remove('is-hidden');

  if (
    data.totalHits === gallery.childElementCount ||
    gallery.childElementCount >= 500
  ) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    //lightbox.refresh();
    btnLoadMore.classList.add('is-hidden');
  }
}
