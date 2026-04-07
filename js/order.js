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
function goToStep(targetStep, scroll) {
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

  // Only scroll when navigating between steps, not on initial load
  if (scroll) {
    const formWrap = document.getElementById('order-form-wrap');
    if (formWrap) {
      setTimeout(() => {
        formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }
}

/* ── Next / Back Buttons ────────────────────────────────────── */
(function initStepNavigation() {
  const nextBtns = document.querySelectorAll('[data-next-step]');
  const backBtns = document.querySelectorAll('[data-prev-step]');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < TOTAL_STEPS) {
        goToStep(currentStep + 1, true);
      }
    });
  });

  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1, true);
      }
    });
  });

  // Initialize: show step 1, no scroll
  goToStep(1, false);
})();

/* ── Conditional fields based on product selection ──────────── */
(function initConditionalFields() {
  const productCheckboxes = document.querySelectorAll('[name="product-type"]');
  const sizeRow     = document.getElementById('size-row');
  const tiersRow    = document.getElementById('tiers-row');
  const quantityRow = document.getElementById('quantity-row');
  if (!productCheckboxes.length) return;

  function updateFieldVisibility() {
    const checked = Array.from(document.querySelectorAll('[name="product-type"]:checked')).map(c => c.value);
    const hasCake     = checked.includes('Custom Cake');
    const hasQuantity = checked.some(v => ['Cupcakes','Royal Icing Cookies','Treats (cakesicles / cake pops / donuts / macarons)'].includes(v));

    if (sizeRow)     sizeRow.hidden     = !hasCake;
    if (tiersRow)    tiersRow.hidden    = !hasCake;
    if (quantityRow) quantityRow.hidden = !hasQuantity;
  }

  productCheckboxes.forEach(c => c.addEventListener('change', updateFieldVisibility));
  updateFieldVisibility();
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
  const productType   = checkedBoxes('product-type').join(', ') || 'Not specified';
  const cakeSize      = val('cake-size');
  const flavours      = checkedBoxes('flavour').join(', ') || val('flavour-other') || 'Not specified';
  const tiers         = val('cake-tiers');
  const quantity      = val('item-quantity');
  const budget        = val('budget');
  const colourTheme   = val('colour-theme');
  const designDesc    = val('design-description');
  const extras        = checkedBoxes('extras').join(', ') || 'None';
  const inspiration   = val('inspiration');
  const phone         = val('customer-phone');
  const collection    = checked('collection-type');
  const notes         = val('final-notes');

  return { name, occasion, eventDate, guests, productType, cakeSize,
           flavours, tiers, quantity, budget, colourTheme, designDesc, extras,
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
    `Product: ${data.productType || 'Not specified'}`,
    data.cakeSize   ? `Cake Size: ${data.cakeSize}` : '',
    data.tiers      ? `Tiers: ${data.tiers}` : '',
    data.quantity   ? `Quantity: ${data.quantity}` : '',
    `Flavour(s): ${data.flavours}`,
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
      goToStep(1, true);
      return;
    }
    if (!data.eventDate) {
      alert('Please enter your event date in Step 1.');
      goToStep(1, true);
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
