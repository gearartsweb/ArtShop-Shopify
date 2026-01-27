document.addEventListener('click', function(event) {
  const button = event.target.closest('.grid-variant-option');
  if (!button) return;

  event.preventDefault();

  const card = button.closest('.studio-product-card');
  const disclosure = button.closest('.grid-variant-disclosure');

  // 1. Update Price and ID (The parts that already work)
  card.querySelector('input[name="id"]').value = button.getAttribute('data-variant-id');
  card.querySelector('.product-price').innerText = button.getAttribute('data-variant-price');

  // 2. Update Label using the unique ID
  const labelId = button.getAttribute('data-parent-label');
  const label = document.getElementById(labelId);
  
  if (label) {
    label.innerText = button.getAttribute('data-title');
  }

  // 3. Close
  disclosure.removeAttribute('open');
});