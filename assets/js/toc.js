// Table of Contents: scroll-spy + collapsible sections
(function () {
  'use strict';

  const toc = document.querySelector('.toc-sticky');
  if (!toc) return;

  const nav = toc.querySelector('nav');
  if (!nav) return;

  const links = [...nav.querySelectorAll('a')];
  if (links.length === 0) return;

  // --- Collapsible: add toggle to parent items ---
  const parents = [...nav.querySelectorAll('li')].filter(li => li.querySelector('ul'));

  parents.forEach(li => {
    const toggle = document.createElement('span');
    toggle.className = 'toc-toggle';
    toggle.textContent = '−'; // expanded by default
    toggle.setAttribute('aria-label', 'Toggle section');

    const anchor = li.querySelector(':scope > a');
    if (anchor) {
      anchor.parentNode.insertBefore(toggle, anchor);
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const childUl = li.querySelector(':scope > ul');
      if (!childUl) return;
      const collapsed = li.classList.toggle('toc-collapsed');
      childUl.style.display = collapsed ? 'none' : '';
      toggle.textContent = collapsed ? '+' : '−';
    });
  });

  // --- Smooth scroll on link click ---
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href');
      if (id && id.startsWith('#')) {
        const target = document.querySelector(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (history.pushState) {
            history.pushState(null, null, id);
          }
        }
      }
    });
  });

  // --- Scroll-spy: highlight current heading ---
  const headings = [...document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6')]
    .filter(el => el.id);

  if (headings.length === 0) return;

  function clearActive() {
    links.forEach(link => {
      const li = link.closest('li');
      if (li) li.classList.remove('selected', 'parent');
    });
  }

  function setActive(id) {
    clearActive();
    const link = links.find(l => decodeURIComponent(l.hash) === '#' + id);
    if (!link) return;
    const li = link.closest('li');
    if (li) {
      li.classList.add('selected');
      // Mark all ancestor li as parent
      let p = li.parentElement?.closest('li');
      while (p) {
        p.classList.add('parent');
        p = p.parentElement?.closest('li');
      }
      // Scroll TOC to keep active visible
      link.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }

  // Use IntersectionObserver with rootMargin to detect which heading is at top
  const observer = new IntersectionObserver(entries => {
    // Find the first intersecting heading closest to top
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length > 0) {
      setActive(visible[0].target.id);
    }
  }, {
    rootMargin: '-80px 0px -75% 0px',
    threshold: 0
  });

  headings.forEach(h => observer.observe(h));

  // Init from URL hash or first heading
  if (window.location.hash) {
    setActive(window.location.hash.substring(1));
  } else if (headings.length > 0) {
    setActive(headings[0].id);
  }
})();
