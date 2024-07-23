(() => {
	'use strict';
	const e = document.getElementById('sign-in-btn'),
		n = sessionStorage.getItem('login');
	n && JSON.parse(n).loggedIn && (e.style.display = 'none');
	const t = document.getElementById('explore-btn'),
		i = document.querySelector('.landing-overlay'),
		a = document.querySelector('.container'),
		o = document.querySelector('.quiz-options'),
		d = document.querySelector('#close-btn'),
		s = document.querySelector('.host-btn'),
		c = document.querySelector('.join-btn');
	t?.addEventListener('click', () => {
		i.style.display = 'none';
	}),
		[
			{ id: 0, name: 'Tech Trends', image: 'tech-trends.jpeg' },
			{ id: 1, name: 'General Knowledge', image: 'general-knowledge.jpg' },
			{ id: 2, name: 'Programming and coding', image: 'programming.jpg' },
			{ id: 3, name: 'Mathematics', image: 'mathematics.jpg' },
			{ id: 4, name: 'Physics', image: 'physics.jpeg' },
			{ id: 5, name: 'Entertainment', image: 'entertainment.jpg' },
		].forEach((e) => {
			a.innerHTML += (({ id: e, name: n, image: t }) =>
				`\n\t<div class="quiz-card" id="${e}">\n\t\t<h1 class="heading">${n}</h1>\n\t\t<img src="assets/img/${t}" alt="${n}" class="quiz-img" loading="lazy" />\n\t\t<button class="quiz-btn" id="${e}">Tap To Play!</button>\n\t</div>\n`)(
				e,
			);
		});
	const l = document.querySelectorAll('.quiz-btn');
	d?.addEventListener('click', () => {
		o.style.display = 'none';
	}),
		l.forEach((e) => {
			e?.addEventListener('click', () => {
				(s.href = `pages/auth/gamepin/index.html?topic=${e.id}&type=host`),
					(c.href = `pages/auth/gamepin/gamepinUI/index.html?topic=${e.id}&type=join`),
					(o.style.display = 'flex');
			});
		});
})();
