(function(){
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('#mobile-menu a');
  const desktopMQ = window.matchMedia('(min-width: 769px)');

  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    menuToggle?.classList.remove('is-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  };

  const toggleMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  [...navLinks, ...mobileLinks].forEach((link) => {
    link.addEventListener('click', () => {
      if (!desktopMQ.matches) {
        closeMenu();
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu || !menuToggle || desktopMQ.matches) return;
    const isClickInside = mobileMenu.contains(event.target) || menuToggle.contains(event.target);
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

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const quicklinkNav = document.querySelector('.quicklink-nav');

  const setOffsets = () => {
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const quicklinkHeight = quicklinkNav?.getBoundingClientRect().height || 0;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--quicklink-height', `${quicklinkHeight}px`);
  };

  setOffsets();
  window.addEventListener('resize', setOffsets);

  if (hero && quicklinkNav) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const shouldStick = !entry.isIntersecting;
          quicklinkNav.classList.toggle('is-sticky', shouldStick);
          setOffsets();
        });
      },
      { threshold: 0 }
    );
    observer.observe(hero);
  }
})();
