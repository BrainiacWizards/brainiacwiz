const exploreBtn = document.getElementById('explore-btn');
const landingOverlay = document.querySelector('.landing-overlay');

exploreBtn.addEventListener('click', () => {
	landingOverlay.style.display = 'none';
});
