document.addEventListener('click', function(event) {
  // 1. Find the clicked variant button
  const button = event.target.closest('.grid-variant-option');
  if (!button) return;

  // 2. Stop the product page from opening
  event.preventDefault();

  const card = button.closest('.studio-product-card');
  const disclosure = button.closest('.grid-variant-disclosure');

  // 3. Update the hidden form ID (The Hand-off)
  const hiddenInput = card.querySelector('input[name="id"]');
  if (hiddenInput) {
    hiddenInput.value = button.getAttribute('data-variant-id');
  }

  // 4. Update the Price display
  const priceDisplay = card.querySelector('.product-price');
  if (priceDisplay) {
    priceDisplay.innerText = button.getAttribute('data-variant-price');
  }

  // 5. Update the Button Label (The "Select Option" change)
  const label = disclosure.querySelector('.current-variant-name');
  if (label) {
    label.innerText = button.innerText.split('\n')[0].trim(); 
  }

  // 6. Close the menu
  disclosure.removeAttribute('open');
});