import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '41124480-b7c87e34b365628c5aebdb367';

export async function galleryPhoto(q, page, perPage) {
  const url = `${BASE_URL}/?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  const response = await axios.get(url);
  return response.data;
}
