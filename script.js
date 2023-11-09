document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('[data-smart-section]');
  let lastVisibleSectionIndex = null;
  let ticking = false; // flag to use with requestAnimationFrame

  // Cache values that are unchanged during scroll events
  const sectionDataValues = Array.from(sections).map(section => section.dataset.smartSection);
  const contextItemsMap = new Map();

  // Precompute and store contextItems in a Map for O(1) access
  document.querySelectorAll('[data-context-item]').forEach(item => {
      contextItemsMap.set(item.dataset.contextItem, item);
  });

  function getVisibilityPercentage(element) {
      const rect = element.getBoundingClientRect();
      const totalHeight = window.innerHeight || document.documentElement.clientHeight;
      const visibleArea = Math.min(rect.bottom, totalHeight) - Math.max(rect.top, 0);
      const elementHeight = rect.bottom - rect.top;
      return Math.max(0, Math.min(visibleArea / elementHeight, 1));
  }

  function updateActiveItem() {
      let mostVisibleSectionIndex = null;
      let highestVisibility = 0;

      // Determine the most visible section
      sectionDataValues.forEach((dataValue, index) => {
          const visibility = getVisibilityPercentage(sections[index]);
          if (visibility > highestVisibility && visibility > 0.2) {
              highestVisibility = visibility;
              mostVisibleSectionIndex = index;
          }
      });

      // Only update if the most visible section has changed
      if (mostVisibleSectionIndex !== lastVisibleSectionIndex) {
          if (lastVisibleSectionIndex !== null) {
              const lastDataValue = sectionDataValues[lastVisibleSectionIndex];
              const lastItem = contextItemsMap.get(lastDataValue);
              if (lastItem) {
                  lastItem.classList.remove('is-active');
              }
          }

          lastVisibleSectionIndex = mostVisibleSectionIndex;

          if (mostVisibleSectionIndex !== null) {
              const newDataValue = sectionDataValues[mostVisibleSectionIndex];
              const newItem = contextItemsMap.get(newDataValue);
              if (newItem) {
                  newItem.classList.add('is-active');
              }
          }
      }
  }

  function throttledUpdateActiveItem() {
      if (!ticking) {
          window.requestAnimationFrame(() => {
              updateActiveItem();
              ticking = false;
          });
          ticking = true;
      }
  }

  // Listen for the scroll event
  window.addEventListener('scroll', throttledUpdateActiveItem);

  // Initialize on page load
  updateActiveItem();
});

/* Action Modals OPEN */
$('[smart-ui-element="open"]').on('click', function() {
  // Select the sibling element with 'smart-ui-element="modal"' and add class
  $(this).siblings('[smart-ui-element="modal"]').addClass('is-action-open');
});

/* Action Modals CLOSE */
$('[smart-ui-element="close"]').on('click', function() {
  // Traverse up to the closest element with 'smart-ui-element="modal"' and remove class
  $(this).closest('[smart-ui-element="modal"]').removeClass('is-action-open');
});

