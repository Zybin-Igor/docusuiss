function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Smooth lang switch (cosmetic only for now)
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// Sticky nav shadow on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.boxShadow = window.scrollY > 10
    ? '0 1px 24px rgba(0,0,0,0.08)' : 'none';
});