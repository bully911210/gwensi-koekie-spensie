/* ── Waitlist Form → WhatsApp ───────────────────────────────── */
(function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name     = document.getElementById('wl-name').value.trim();
    const phone    = document.getElementById('wl-phone').value.trim();
    const location = document.getElementById('wl-location').value.trim();
    const level    = form.querySelector('input[name="level"]:checked');
    const note     = document.getElementById('wl-note').value.trim();

    if (!name || !phone) {
      const missing = !name ? document.getElementById('wl-name') : document.getElementById('wl-phone');
      missing.focus();
      missing.style.borderColor = '#DC2626';
      setTimeout(() => { missing.style.borderColor = ''; }, 2000);
      return;
    }

    const levelLabel = level ? level.value.replace(/-/g, ' ') : 'not specified';

    const parts = [
      'Hi Gwensi! 🍪 I\'d like to join the waitlist for the Royal Icing Cookie Course.',
      '',
      `Name: ${name}`,
      `WhatsApp: ${phone}`,
      location ? `Based in: ${location}` : null,
      `Experience: ${levelLabel}`,
      note ? `\nNote: ${note}` : null,
    ].filter(Boolean).join('\n');

    const url = 'https://wa.me/27784516111?text=' + encodeURIComponent(parts);
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  /* Clear red border on input */
  ['wl-name', 'wl-phone'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { el.style.borderColor = ''; });
  });
})();
