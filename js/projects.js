(function(){
  const listEl = document.getElementById('projects-list');
  const statusEl = document.getElementById('projects-status');

  if (!listEl || !statusEl) return;

  const setStatus = (message) => {
    statusEl.textContent = message;
    statusEl.hidden = false;
  };

  const clearStatus = () => {
    statusEl.textContent = '';
    statusEl.hidden = true;
  };

  const normalizeImages = (images) => {
    if (!Array.isArray(images)) return [];
    return images
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          if (typeof item.image === 'string') return item.image;
          if (typeof item.src === 'string') return item.src;
        }
        return null;
      })
      .filter(Boolean);
  };

  const renderProjects = (projects) => {
    listEl.innerHTML = '';

    if (!projects.length) {
      setStatus('No projects yet — check back soon.');
      return;
    }

    clearStatus();
    const fragment = document.createDocumentFragment();

    projects.forEach((project, index) => {
      const { id = '', title = 'Untitled project', description = '', images = [] } = project || {};
      const projectCard = document.createElement('article');
      projectCard.className = 'project-card twh-reveal';
      projectCard.setAttribute('data-project-id', id || `project-${index + 1}`);

      const header = document.createElement('div');
      header.className = 'project-card__header';

      const titleEl = document.createElement('h2');
      titleEl.className = 'project-card__title';
      titleEl.textContent = title;
      header.appendChild(titleEl);

      if (id) {
        const meta = document.createElement('p');
        meta.className = 'project-card__meta';
        meta.textContent = id;
        header.appendChild(meta);
      }

      projectCard.appendChild(header);

      if (description) {
        const descriptionEl = document.createElement('p');
        descriptionEl.className = 'project-card__description';
        descriptionEl.textContent = description;
        projectCard.appendChild(descriptionEl);
      }

      const imageList = normalizeImages(images);
      if (imageList.length) {
        const gallery = document.createElement('div');
        gallery.className = 'project-gallery';

        imageList.forEach((imageSrc, imageIndex) => {
          const link = document.createElement('a');
          link.className = 'project-gallery__item';
          link.href = imageSrc;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';

          const img = document.createElement('img');
          img.className = 'project-gallery__thumb';
          img.loading = 'lazy';
          img.decoding = 'async';
          img.src = imageSrc;
          img.alt = `${title} photo ${imageIndex + 1}`;

          link.appendChild(img);
          gallery.appendChild(link);
        });

        projectCard.appendChild(gallery);
      }

      fragment.appendChild(projectCard);
    });

    listEl.appendChild(fragment);
  };

  const normalizeProjects = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.projects)) return data.projects;
    return [];
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/content/projects.json', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const projects = normalizeProjects(data);
      renderProjects(projects);
    } catch (error) {
      console.error('Error loading projects.json', error);
      setStatus('We couldn’t load projects right now. Please try again soon.');
    }
  };

  loadProjects();
})();
