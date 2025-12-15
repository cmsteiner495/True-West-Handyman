(function(){
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('#mobile-menu a');
  const desktopMQ = window.matchMedia('(min-width: 769px)');
  const reviewModal = document.getElementById('review-modal');
  const reviewModalTitle = document.getElementById('review-modal-title');
  const reviewModalText = document.querySelector('.review-modal__text');
  const reviewModalDialog = document.querySelector('.review-modal__dialog');
  const reviewModalClose = document.querySelector('.review-modal__close');
  const reviewCards = document.querySelectorAll('.review-card');
  const quicklinks = document.querySelectorAll('.quicklink');
  const trackedSections = ['reviews', 'portfolio', 'faqs']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const closeReviewModal = () => {
    if (!reviewModal) return;
    reviewModal.classList.remove('is-open');
    reviewModal.setAttribute('aria-hidden', 'true');
  };

  const openReviewModal = (card) => {
    if (!reviewModal || !reviewModalTitle || !reviewModalText || !reviewModalDialog) return;
    const { reviewer = '', full = '' } = card.dataset;
    reviewModalTitle.textContent = reviewer;
    reviewModalText.textContent = full;
    reviewModal.classList.add('is-open');
    reviewModal.setAttribute('aria-hidden', 'false');
    reviewModalDialog.focus({ preventScroll: true });
  };

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
      closeReviewModal();
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

  const setActiveQuicklink = (id) => {
    quicklinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const targetId = href.replace('#', '');
      link.classList.toggle('is-active', targetId === id);
    });
  };

  const handleScrollSpy = () => {
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const quicklinkHeight = quicklinkNav?.getBoundingClientRect().height || 0;
    const marker = headerHeight + quicklinkHeight + 16;

    let activeId = trackedSections[0]?.id;
    let closestDelta = Number.POSITIVE_INFINITY;

    trackedSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const topDiff = rect.top - marker;
      const bottomDiff = rect.bottom - marker;

      if (topDiff <= 0 && bottomDiff >= 0) {
        activeId = section.id;
        closestDelta = 0;
      } else if (Math.abs(topDiff) < closestDelta) {
        closestDelta = Math.abs(topDiff);
        activeId = section.id;
      }
    });

    if (activeId) {
      setActiveQuicklink(activeId);
    }
  };

  setOffsets();
  handleScrollSpy();
  window.addEventListener('resize', () => {
    setOffsets();
    handleScrollSpy();
  });
  window.addEventListener('load', () => {
    setOffsets();
    handleScrollSpy();
  });
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(handleScrollSpy);
  });

  reviewCards.forEach((card) => {
    card.addEventListener('click', () => openReviewModal(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openReviewModal(card);
      }
    });
  });

  reviewModal?.addEventListener('click', (event) => {
    if (event.target === reviewModal || event.target.classList.contains('review-modal__backdrop')) {
      closeReviewModal();
    }
  });

  reviewModalClose?.addEventListener('click', () => closeReviewModal());

  reviewModalDialog?.setAttribute('tabindex', '-1');

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
