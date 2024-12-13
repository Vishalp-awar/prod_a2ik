AOS.init();
// show data
function setCondition(condition) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));

  // Show the selected section
  const targetSection = document.getElementById(condition);
  targetSection.classList.remove('hidden');

  // Scroll to the visible section
  targetSection.scrollIntoView({
    behavior: 'smooth', // Smooth scrolling
    block: 'start'      // Align to the top of the viewport
  });
}
