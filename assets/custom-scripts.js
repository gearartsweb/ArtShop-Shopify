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

// Paint Matrix Filter Logic
document.body.addEventListener('input', function(e) {
  if (e.target.id === 'color-search-input' || e.target.name === 'size_filter') {
    const searchTerm = document.getElementById('color-search-input').value.toLowerCase();
    const selectedSize = document.querySelector('input[name="size_filter"]:checked').value;
    const items = document.querySelectorAll('.color-swatch-item');

    items.forEach(item => {
      const color = item.getAttribute('data-color').toLowerCase();
      const size = item.getAttribute('data-size');
      const matchesSearch = color.includes(searchTerm);
      const matchesSize = (size === selectedSize);

      item.style.display = (matchesSearch && matchesSize) ? 'block' : 'none';
    });
  }
});

function selectMatrixVariant(id, price, element) {
  // Update Hidden ID
  document.getElementById('selected-variant-id').value = id;
  // Update Price Display
  document.querySelector('.product-price').innerText = price;
  // Update Active UI
  document.querySelectorAll('.color-swatch-item').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
  // Update Label
  document.getElementById('current-selection-label').innerText = element.getAttribute('data-color');
}