// scripts/main.js

// Переключение FAQ
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Переключение языков
function changeLang(lang) {
  const pages = {
    'fr': 'index.html',
    'de': 'de.html',
    'en': 'en.html',
    'ua': 'ua.html'
  };
  if (pages[lang]) {
    window.location.href = pages[lang];
  }
}

// Тень для навбара при скролле
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 10 ? '0 1px 24px rgba(0,0,0,0.08)' : 'none';
  }
});
// scripts/main.js

window.toggleFaq = function (el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
};

window.changeLang = function (lang) {
  const pages = {
    'fr': 'index.html',
    'de': 'de.html',
    'en': 'en.html',
    'ua': 'ua.html'
  };
  if (pages[lang]) {
    window.location.href = pages[lang];
  }
};

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 10 ? '0 1px 24px rgba(0,0,0,0.08)' : 'none';
  }
});