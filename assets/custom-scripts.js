/**
 * ArtShop Global Quantity Fix (Corrected)
 * - Uses Event Delegation for AJAX Cart compatibility.
 * - Fixes syntax errors from previous version.
 */

document.body.addEventListener('click', function(event) {
  // 1. Identify the trigger (Target the button, even if user clicks the icon inside)
  const button = event.target.closest('button[name="plus"], button[name="minus"]');
  
  // Exit if we didn't click a quantity button
  if (!button) return;

  // 2. Prevent default browser navigation/jumping
  event.preventDefault();

  // 3. Robust Input Discovery
  // Look for the standard Dawn wrapper <quantity-input> or a generic .quantity container
  const parent = button.closest('quantity-input') || button.closest('.quantity') || button.parentElement;
  const input = parent.querySelector('input.quantity__input') || parent.querySelector('input[type="number"]');

  // 4. Execute Logic if input is found
  if (input) {
    const isPlus = button.name === 'plus';
    const currentValue = parseInt(input.value) || 0;
    
    // Logic: Plus adds 1. Minus goes down to 1.
    // We stop at 1 to prevent accidental removal (User must click "Remove" to delete).
    const newValue = isPlus ? currentValue + 1 : Math.max(1, currentValue - 1);

    if (currentValue !== newValue) {
      input.value = newValue;
      
      // 5. CRITICAL: Dispatch the 'change' event so Shopify Updates the Cart
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
});