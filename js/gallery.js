/* ============================================================
   GALLERY.JS — Filter Tabs + Lightbox
   Gwensi Koekie Spensie
   ============================================================ */

'use strict';

/* ── Gallery Filter Tabs ────────────────────────────────────── */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach((item, index) => {
        const show = filter === 'all' || item.dataset.category === filter;

        if (show) {
          item.style.display = 'block';
          // Stagger reveal
          item.style.opacity = '0';
          item.style.transform = 'translateY(16px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 40);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();

/* ── Lightbox ───────────────────────────────────────────────── */
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  let overlay = null;

  function openLightbox(src, alt) {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image preview');

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.addEventListener('click', e => e.stopPropagation());

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close image preview');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeLightbox);

    overlay.appendChild(closeBtn);
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Close on backdrop click
    overlay.addEventListener('click', closeLightbox);

    // Close on Escape
    document.addEventListener('keydown', handleKeyDown);
  }

  function closeLightbox() {
    if (overlay) {
      overlay.remove();
      overlay = null;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  items.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;

    item.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });

    // Keyboard accessible
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });
})();
