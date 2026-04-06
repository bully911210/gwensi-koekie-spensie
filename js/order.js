/* ============================================================
   ORDER.JS — Multi-Step Form + WhatsApp Message Builder
   Gwensi Koekie Spensie
   ============================================================ */

'use strict';

const TOTAL_STEPS = 4;
let currentStep = 1;

const TRANSITION_MESSAGES = {
  1: null,
  2: 'Beautiful — now let\'s build your cake. 🎂',
  3: 'Great choice! Let\'s talk about the look.',
  4: 'Almost there — just one more thing and we\'re ready to go!'
};

/* ── Set Date Minimum (today + 5 days) ─────────────────────── */
(function initDateMin() {
  const dateInput = document.getElementById('event-date');
  if (!dateInput) return;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 5);
  const yyyy = minDate.getFullYear();
  const mm = String(minDate.getMonth() + 1).padStart(2, '0');
  const dd = String(minDate.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
})();

/* ── Step Navigation ────────────────────────────────────────── */
function goToStep(targetStep) {
  const steps = document.querySelectorAll('.form-step');
  const dots = document.querySelectorAll('.step-dot');
  const msgEl = document.getElementById('transition-msg');

  // Hide all steps
  steps.forEach((step, i) => {
    step.hidden = (i + 1) !== targetStep;
  });

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === targetStep) {
      dot.classList.add('active');
    } else if (i + 1 < targetStep) {
      dot.classList.add('done');
    }
  });

  // Show transition message
  if (msgEl && TRANSITION_MESSAGES[targetStep]) {
    msgEl.textContent = TRANSITION_MESSAGES[targetStep];
    msgEl.classList.add('visible');
  } else if (msgEl) {
    msgEl.classList.remove('visible');
  }

  currentStep = targetStep;

  // Scroll to top of form
  const formWrap = document.getElementById('order-form-wrap');
  if (formWrap) {
    setTimeout(() => {
      formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}

/* ── Next / Back Buttons ────────────────────────────────────── */
(function initStepNavigation() {
  const nextBtns = document.querySelectorAll('[data-next-step]');
  const backBtns = document.querySelectorAll('[data-prev-step]');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < TOTAL_STEPS) {
        goToStep(currentStep + 1);
      }
    });
  });

  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });

  // Initialize: show step 1
  goToStep(1);
})();

/* ── Conditional: Show cake size only if Cake selected ──────── */
(function initConditionalSize() {
  const productRadios = document.querySelectorAll('[name="product-type"]');
  const sizeRow = document.getElementById('size-row');
  if (!productRadios.length || !sizeRow) return;

  function updateSizeVisibility() {
    const selected = document.querySelector('[name="product-type"]:checked');
    if (selected && selected.value === 'cake') {
      sizeRow.hidden = false;
    } else {
      sizeRow.hidden = true;
    }
  }

  productRadios.forEach(r => r.addEventListener('change', updateSizeVisibility));
  updateSizeVisibility();
})();

/* ── WhatsApp Message Builder ───────────────────────────────── */
function collectFormData() {
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function checked(name) {
    const radios = document.querySelectorAll(`[name="${name}"]:checked`);
    return Array.from(radios).map(r => r.value).join(', ');
  }

  function checkedBoxes(name) {
    const boxes = document.querySelectorAll(`[name="${name}"]:checked`);
    return Array.from(boxes).map(b => b.value);
  }

  const name          = val('customer-name');
  const occasion      = val('occasion-type');
  const eventDate     = val('event-date');
  const guests        = val('guest-count');
  const productType   = checked('product-type');
  const cakeSize      = val('cake-size');
  const flavours      = checkedBoxes('flavour').join(', ') || val('flavour-other') || 'Not specified';
  const tiers         = val('cake-tiers');
  const budget        = val('budget');
  const colourTheme   = val('colour-theme');
  const designDesc    = val('design-description');
  const extras        = checkedBoxes('extras').join(', ') || 'None';
  const inspiration   = val('inspiration');
  const phone         = val('customer-phone');
  const collection    = checked('collection-type');
  const notes         = val('final-notes');

  return { name, occasion, eventDate, guests, productType, cakeSize,
           flavours, tiers, budget, colourTheme, designDesc, extras,
           inspiration, phone, collection, notes };
}

function buildWhatsAppMessage(data) {
  const lines = [
    'Hi Gwensi! 🎂 I\'d love to place an order.',
    '',
    `Name: ${data.name || 'Not provided'}`,
    `Occasion: ${data.occasion || 'Not specified'} on ${data.eventDate || 'TBC'}`,
    `Guests: ${data.guests || 'Not specified'}`,
    '',
    `Product: ${data.productType || 'Not specified'}${data.cakeSize ? ' | ' + data.cakeSize : ''}`,
    `Flavour(s): ${data.flavours}`,
    data.tiers ? `Tiers: ${data.tiers}` : '',
    `Budget: ${data.budget || 'Not specified'}`,
    '',
    `Colour Theme: ${data.colourTheme || 'Not specified'}`,
    `Design Style: ${data.designDesc || 'Not specified'}`,
    `Extras: ${data.extras}`,
    data.inspiration ? `Inspiration: ${data.inspiration}` : '',
    '',
    `My WhatsApp: ${data.phone || 'Same as this number'}`,
    `Collection/Delivery: ${data.collection || 'Not specified'}`,
    data.notes ? `\nNotes: ${data.notes}` : '',
  ];

  return lines.filter(l => l !== '').join('\n');
}

(function initWhatsAppButton() {
  const btn = document.getElementById('build-message-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const data = collectFormData();

    // Basic validation
    if (!data.name) {
      alert('Please enter your name in Step 1.');
      goToStep(1);
      return;
    }
    if (!data.eventDate) {
      alert('Please enter your event date in Step 1.');
      goToStep(1);
      return;
    }
    if (!data.phone) {
      alert('Please enter your WhatsApp number.');
      return;
    }

    const message = buildWhatsAppMessage(data);
    const url = 'https://wa.me/27784516111?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
