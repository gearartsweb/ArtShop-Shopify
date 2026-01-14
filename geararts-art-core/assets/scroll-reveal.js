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