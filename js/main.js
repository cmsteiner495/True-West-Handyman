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
  const stickyShell = document.querySelector('.sticky-shell');
  const quicklinkNav = document.querySelector('.quicklink-nav');
  const hero = document.querySelector('.hero');
  const portfolioTrack = document.querySelector('.portfolio-track');
  const portfolioDots = document.querySelector('.carousel-dots');
  const reviewsTrack = document.querySelector('.reviews-track');
  const reviewSlides = reviewsTrack ? Array.from(reviewsTrack.querySelectorAll('.review-slide')) : [];
  const reviewsDots = document.querySelector('.reviews-dots');
  const mobileReviewsMQ = window.matchMedia('(max-width: 768px)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
    const href = anchor.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    setActiveQuicklink(targetId);
    smoothScrollTo(targetId);
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
    const cards = Array.from(portfolioTrack.querySelectorAll('.portfolio-item'));
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
