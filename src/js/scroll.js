let lastScrollTop = 0;
let scrollDirection = '';
import { header, input, searchForm } from './index';

export function handleHeaderScroll() {
  window.addEventListener('scroll', () => {
    const currentScroll =
      window.window.scrollY || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      if (scrollDirection !== 'down') {
        scrollDirection = 'down';
        // header.classList.add('hidden');
        (header, input, searchForm).classList.add('hidden');
      }
    } else {
      if (scrollDirection !== 'up') {
        scrollDirection = 'up';
        //header.classList.remove('hidden');
        (header, input, searchForm).classList.remove('hidden');
      }
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}
