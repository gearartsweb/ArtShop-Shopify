document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.2 // Trigger when 20% of the element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once it's visible, we stop observing it
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Target all our story rows
  document.querySelectorAll('.story-row').forEach(row => {
    row.classList.add('reveal-on-scroll');
    observer.observe(row);
  });
});

/* Quantity Button Fix - Event Delegation */
document.body.addEventListener('click', (event) => {
  const button = event.target.closest('button[name="plus"], button[name="minus"]');
  if (!button) return;

  event.preventDefault();
  const parent = button.closest('.quantity') || button.parentElement;
  const input = parent.querySelector('input.quantity__input');
  
  if (input) {
    let value = parseInt(input.value) || 1;
    if (button.name === 'plus') {
      input.value = value + 1;
    } else if (value > 1) {
      input.value = value - 1;
    }
    // Trigger 'change' so the cart AJAX logic updates the totals
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
});