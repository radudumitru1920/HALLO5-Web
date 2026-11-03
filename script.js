const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

hamburgerBtn.addEventListener('click', function() {
  navMenu.classList.toggle('hidden');
  header.classList.toggle('h-60');
});