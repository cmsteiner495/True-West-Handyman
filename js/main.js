(function(){
  const hasIdentityTokenHash = Boolean(window.__NETLIFY_DISABLE_HASH_HANDLERS__);
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
  const stickyShell = document.querySelector('.sticky-shell');
  const quicklinkNav = document.querySelector('.quicklink-nav');
  const hero = document.querySelector('.hero');
  const portfolioTrack = document.querySelector('.portfolio-track');
  const portfolioDots = document.querySelector('.carousel-dots');
  const portfolioCards = portfolioTrack ? Array.from(portfolioTrack.querySelectorAll('.portfolio-item')) : [];
  const reviewsTrack = document.querySelector('.reviews-track');
  const reviewSlides = reviewsTrack ? Array.from(reviewsTrack.querySelectorAll('.review-slide')) : [];
  const reviewsDots = document.querySelector('.reviews-dots');
  const mobileReviewsMQ = window.matchMedia('(max-width: 768px)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const portfolioModal = document.getElementById('portfolio-modal');
  const portfolioModalClose = document.querySelector('.portfolio-modal__close');
  const portfolioModalPreview = document.getElementById('portfolio-modal-preview');
  const portfolioModalTitle = document.getElementById('portfolio-modal-title');
  const portfolioModalThumbs = document.querySelector('.portfolio-modal__thumbs');
  let lastFocusedPortfolioCard = null;

  const PLACEHOLDER_FILES = ['placeholder1.png', 'placeholder2.png', 'placeholder3.png', 'placeholder4.png'];

  const projectImageMap = {
    project1: PLACEHOLDER_FILES,
    project2: PLACEHOLDER_FILES,
    project3: PLACEHOLDER_FILES.filter((file) => file !== 'placeholder4.png'),
    project4: PLACEHOLDER_FILES.filter((file) => file !== 'placeholder4.png'),
  };

  const buildProjectImages = (projectKey) =>
    (projectImageMap[projectKey] || PLACEHOLDER_FILES)
      .map((file) => `img/${projectKey}/${file}`)
      .filter(Boolean);

  const PROJECTS = {
    project1: {
      title: 'Fresh Look for a Fading Deck.',
      images: buildProjectImages('project1'),
    },
    project2: {
      title: 'Replacing Old Carpet.',
      images: buildProjectImages('project2'),
    },
    project3: {
      title: 'Full Bathroom Remodel.',
      images: buildProjectImages('project3'),
    },
    project4: {
      title: 'Rebuilding a Deck.',
      images: buildProjectImages('project4'),
    },
  };

  const rotationState = new Map();

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
    link.addEventListener('click', (event) => {
      interceptAnchor(event, link);
      if (!desktopMQ.matches) {
        closeMenu();
      }
    });
  });

  quicklinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      interceptAnchor(event, link);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      interceptAnchor(event, anchor);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      closeReviewModal();
      closePortfolioModal();
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

  const normalizePath = (pathname = '') => {
    const segments = pathname.split('/').filter(Boolean);
    const last = segments.pop() || 'index.html';
    if (last === 'thank-you.html') return 'contact.html';
    return last || 'index.html';
  };

  const setActiveNav = () => {
    const current = normalizePath(window.location.pathname);
    [...navLinks, ...mobileLinks].forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkPath = normalizePath(new URL(href, window.location.href).pathname);
      const isActive = linkPath === current || (linkPath === 'index.html' && current === '');
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  setActiveNav();

  const setOffsets = () => {
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const quicklinkHeight = quicklinkNav?.getBoundingClientRect().height || 0;
    const shellHeight = (stickyShell?.getBoundingClientRect().height || 0) + quicklinkHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--quicklink-height', `${quicklinkHeight}px`);
    document.documentElement.style.setProperty('--shell-height', `${shellHeight}px`);
  };

  const setActiveQuicklink = (id) => {
    quicklinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const targetId = href.replace('#', '');
      link.classList.toggle('is-active', targetId === id);
    });
  };

  const handleScrollSpy = () => {
    const shellHeight = (stickyShell?.getBoundingClientRect().height || 0) + (quicklinkNav?.getBoundingClientRect().height || 0);
    const marker = shellHeight + 12;

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

  const smoothScrollTo = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const shellHeight = (stickyShell?.getBoundingClientRect().height || 0) + (quicklinkNav?.getBoundingClientRect().height || 0);
    const offsetTop = window.scrollY + target.getBoundingClientRect().top - shellHeight - 8;
    window.scrollTo({
      top: offsetTop,
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
    });
  };

  const interceptAnchor = (event, anchor) => {
    if (hasIdentityTokenHash) return;
    const href = anchor.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    setActiveQuicklink(targetId);
    smoothScrollTo(targetId);
  };

  const ensureProjectOverlay = (img) => {
    if (!img) return null;
    const wrapper = img.closest('.portfolio-item');
    if (!wrapper) return null;
    let overlay = wrapper.querySelector('.project-card-img--next');
    if (!overlay) {
      overlay = document.createElement('img');
      overlay.className = 'project-card-img project-card-img--next';
      overlay.alt = '';
      overlay.loading = 'lazy';
      overlay.decoding = 'async';
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      if (width) overlay.setAttribute('width', width);
      if (height) overlay.setAttribute('height', height);
      wrapper.appendChild(overlay);
    }
    return overlay;
  };

  const crossfadeProjectImage = (baseImg, overlayImg, nextSrc) => {
    if (!baseImg || !nextSrc) return;
    if (!overlayImg) {
      baseImg.src = nextSrc;
      return;
    }

    overlayImg.src = nextSrc;
    requestAnimationFrame(() => {
      overlayImg.classList.add('is-visible');
      baseImg.classList.add('is-fading-out');
    });

    overlayImg.addEventListener(
      'transitionend',
      () => {
        baseImg.src = nextSrc;
        overlayImg.classList.remove('is-visible');
        baseImg.classList.remove('is-fading-out');
      },
      { once: true }
    );
  };

  const setPortfolioPreview = (project, src, thumbBtn) => {
    if (!portfolioModalPreview || !portfolioModalThumbs || !project) return;
    portfolioModalPreview.src = src;
    portfolioModalPreview.alt = `${project.title} preview`;
    const thumbs = portfolioModalThumbs.querySelectorAll('.portfolio-thumb');
    thumbs.forEach((thumb) => {
      thumb.classList.toggle('is-active', thumb === thumbBtn);
    });
  };

  const closePortfolioModal = () => {
    if (!portfolioModal) return;
    portfolioModal.classList.remove('is-open');
    portfolioModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    portfolioModalThumbs?.replaceChildren();
    if (lastFocusedPortfolioCard) {
      lastFocusedPortfolioCard.focus({ preventScroll: true });
      lastFocusedPortfolioCard = null;
    }
  };

  const openPortfolioModal = (projectKey, triggerEl) => {
    const project = PROJECTS[projectKey];
    if (!project || !portfolioModal || !portfolioModalTitle || !portfolioModalPreview || !portfolioModalThumbs) return;

    lastFocusedPortfolioCard = triggerEl || null;
    portfolioModalTitle.textContent = project.title;
    portfolioModalThumbs.replaceChildren();

    project.images.forEach((src, index) => {
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = 'portfolio-thumb';
      thumbBtn.setAttribute('role', 'listitem');
      thumbBtn.setAttribute('aria-label', `${project.title} image ${index + 1}`);

      const thumbImg = document.createElement('img');
      thumbImg.src = src;
      thumbImg.alt = `${project.title} thumbnail ${index + 1}`;
      thumbImg.loading = 'lazy';
      thumbImg.decoding = 'async';
      thumbImg.width = 240;
      thumbImg.height = 180;
      thumbBtn.appendChild(thumbImg);

      thumbBtn.addEventListener('click', () => setPortfolioPreview(project, src, thumbBtn));
      portfolioModalThumbs.appendChild(thumbBtn);

      if (index === 0) {
        setPortfolioPreview(project, src, thumbBtn);
      }
    });

    portfolioModal.classList.add('is-open');
    portfolioModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    portfolioModalClose?.focus({ preventScroll: true });
  };

  const initPortfolioCard = (card) => {
    const projectKey = card.dataset.project;
    const project = PROJECTS[projectKey];
    const img = card.querySelector('.project-card-img');
    if (!project || !img) return;

    const overlayImg = ensureProjectOverlay(img);
    const existingIndex = project.images.findIndex((src) => img.getAttribute('src') === src);
    let currentIndex = existingIndex >= 0 ? existingIndex : 0;
    img.src = project.images[currentIndex];
    card.setAttribute('aria-label', project.title);

    const swapImage = () => {
      currentIndex = (currentIndex + 1) % project.images.length;
      crossfadeProjectImage(img, overlayImg, project.images[currentIndex]);
    };

    const startRotation = () => {
      if (prefersReducedMotion.matches || project.images.length <= 1) return;
      const existing = rotationState.get(card);
      if (existing?.timer) {
        clearInterval(existing.timer);
      }
      const timer = window.setInterval(swapImage, 4200);
      rotationState.set(card, { timer, stop: stopRotation, start: startRotation });
    };

    const stopRotation = () => {
      const state = rotationState.get(card);
      if (state?.timer) {
        clearInterval(state.timer);
        state.timer = null;
      }
    };

    rotationState.set(card, { timer: null, stop: stopRotation, start: startRotation });
    startRotation();

    card.addEventListener('mouseenter', stopRotation);
    card.addEventListener('focus', stopRotation);
    card.addEventListener('mouseleave', startRotation);
    card.addEventListener('blur', startRotation);
    card.addEventListener('click', () => openPortfolioModal(projectKey, card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPortfolioModal(projectKey, card);
      }
    });
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

  portfolioCards.forEach((card) => initPortfolioCard(card));

  prefersReducedMotion.addEventListener('change', (event) => {
    rotationState.forEach((state) => {
      if (event.matches) {
        state.stop?.();
      } else {
        state.start?.();
      }
    });
  });

  portfolioModal?.addEventListener('click', (event) => {
    if (event.target === portfolioModal || event.target.classList.contains('portfolio-modal__backdrop')) {
      closePortfolioModal();
    }
  });

  portfolioModalClose?.addEventListener('click', () => closePortfolioModal());

  if (hero && stickyShell) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const shouldStick = !entry.isIntersecting;
          stickyShell.classList.toggle('is-floating', shouldStick);
          quicklinkNav?.classList.toggle('is-floating', shouldStick);
          setOffsets();
        });
      },
      { threshold: 0, rootMargin: '-4px 0px 0px 0px' }
    );
    observer.observe(hero);
  }

  const layeredSections = document.querySelectorAll('.section.has-overlay');
  if (layeredSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-active', entry.isIntersecting);
        });
      },
      {
        rootMargin: `-${(stickyShell?.getBoundingClientRect().height || 0) + 32}px 0px -28% 0px`,
        threshold: [0, 0.25, 0.45, 0.8],
      }
    );

    layeredSections.forEach((section) => sectionObserver.observe(section));
  }

  if (portfolioTrack && portfolioDots) {
    const cards = portfolioCards;
    const createDots = () => {
      portfolioDots.innerHTML = '';
      cards.forEach((card, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to project ${index + 1}`);
        dot.addEventListener('click', () => {
          const targetLeft = card.offsetLeft - (portfolioTrack.clientWidth - card.clientWidth) / 2;
          portfolioTrack.scrollTo({
            left: targetLeft,
            behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
          });
        });
        portfolioDots.appendChild(dot);
      });
    };

    const updateDots = () => {
      if (!cards.length) return;
      const center = portfolioTrack.scrollLeft + portfolioTrack.clientWidth / 2;
      let closestIndex = 0;
      let minDelta = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const delta = Math.abs(center - cardCenter);
        if (delta < minDelta) {
          minDelta = delta;
          closestIndex = index;
        }
      });
      const dots = portfolioDots.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => dot.classList.toggle('is-active', index === closestIndex));
    };

    createDots();
    updateDots();

    let ticking = false;
    portfolioTrack.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateDots();
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener('resize', () => {
      setOffsets();
      updateDots();
    });
  }

  const scrollToReviewSlide = (index) => {
    if (!reviewsTrack || !reviewSlides.length) return;
    const target = reviewSlides[index];
    if (!target) return;
    reviewsTrack.scrollTo({
      left: target.offsetLeft,
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
    });
  };

  const updateReviewDots = () => {
    if (!reviewsDots || !reviewSlides.length) return;
    reviewsDots.innerHTML = '';
    reviewSlides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to review set ${index + 1}`);
      dot.addEventListener('click', () => scrollToReviewSlide(index));
      reviewsDots.appendChild(dot);
    });
  };

  const setActiveReviewDot = () => {
    if (!reviewsDots || !reviewsTrack || !reviewSlides.length || !mobileReviewsMQ.matches) return;
    const center = reviewsTrack.scrollLeft + reviewsTrack.clientWidth / 2;
    let activeIndex = 0;
    let minDelta = Number.POSITIVE_INFINITY;
    reviewSlides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const delta = Math.abs(center - slideCenter);
      if (delta < minDelta) {
        minDelta = delta;
        activeIndex = index;
      }
    });
    reviewsDots.querySelectorAll('.reviews-dot').forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
    });
  };

  const syncReviewCarousel = () => {
    if (!reviewsTrack) return;
    if (!mobileReviewsMQ.matches) {
      reviewsTrack.scrollTo({ left: 0, behavior: 'auto' });
      return;
    }
    setActiveReviewDot();
  };

  if (reviewsTrack && reviewSlides.length) {
    updateReviewDots();
    setActiveReviewDot();

    let ticking = false;
    reviewsTrack.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setActiveReviewDot();
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener('resize', () => {
      setOffsets();
      syncReviewCarousel();
    });

    mobileReviewsMQ.addEventListener('change', () => {
      syncReviewCarousel();
    });
  }
})();
