(function(){
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');
  const desktopMQ = window.matchMedia('(min-width: 900px)');

  const closeMenu = () => {
    if (nav) {
      nav.classList.remove('is-open');
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (!desktopMQ.matches) {
        closeMenu();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav || desktopMQ.matches) return;
    const isClickInside = nav.contains(event.target);
    if (!isClickInside) {
      closeMenu();
    }
  });

  desktopMQ.addEventListener('change', (event) => {
    if (event.matches) {
      closeMenu();
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
