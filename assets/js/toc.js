// Keep navigation inside the directory from moving the article viewport.
(function () {
  'use strict';
  const panel = document.querySelector('.toc-panel');
  if (!panel) return;
  const toc = panel.querySelector('.toc-sticky');
  const nav = toc.querySelector('nav');
  const links = [...nav.querySelectorAll('a')];
  if (!links.length) return;

  const wide = matchMedia('(min-width: 1280px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  panel.open = wide.matches;
  wide.addEventListener('change', () => { panel.open = wide.matches; });

  nav.querySelectorAll('li').forEach(li => {
    const children = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    if (!children || !anchor) return;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'toc-toggle';
    toggle.textContent = '−';
    toggle.setAttribute('aria-label', `收起${anchor.textContent}的子目录`);
    toggle.setAttribute('aria-expanded', 'true');
    anchor.before(toggle);
    toggle.addEventListener('click', () => {
      const collapsed = li.classList.toggle('toc-collapsed');
      toggle.textContent = collapsed ? '+' : '−';
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.setAttribute('aria-label', `${collapsed ? '展开' : '收起'}${anchor.textContent}的子目录`);
    });
  });

  links.forEach(link => {
    link.addEventListener('click', e => {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      if (!wide.matches) panel.open = false;
      target.scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start'});
      history.pushState(null, '', link.hash);
    });
  });

  const headings = [...document.querySelectorAll('.post-content :is(h1,h2,h3,h4,h5,h6)[id]')];
  function setActive(id) {
    links.forEach(link => {
      const active = decodeURIComponent(link.hash.slice(1)) === id;
      link.parentElement.classList.toggle('selected', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
      if (active && wide.matches && panel.open) {
        const bounds = toc.getBoundingClientRect();
        const item = link.getBoundingClientRect();
        if (item.top < bounds.top || item.bottom > bounds.bottom) {
          toc.scrollTop += item.top - bounds.top - toc.clientHeight / 2;
        }
      }
    });
  }

  let ticking = false;
  function update() {
    const current = [...headings].reverse().find(h => h.getBoundingClientRect().top <= 100) || headings[0];
    if (current) setActive(current.id);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, {passive: true});
  update();
})();
