import { getOverallRanking } from '../../pages/auth/fb.js';
const rankingTableBody = document.querySelector('#ranking-body');

// get the overall ranking
async function getRanking() {
	const overallRanking = await getOverallRanking();
	rankingTableBody.innerHTML = '';

	// sort the ranking by time latest to oldest
	let sortedRanking = overallRanking.sort((a, b) => b.points - a.points);

	// create the ranking table
	sortedRanking.forEach(async (player, index) => {
		const row = document.createElement('tr');
		const rank = document.createElement('td');
		const username = document.createElement('td');
		const points = document.createElement('td');
		const time = document.createElement('td');
		const startTime = document.createElement('td');
		const duration = document.createElement('td');

		rank.textContent = index + 1;
		username.textContent = player.username;
		points.textContent = player.points;

		const { dateString, startDateString, durationString } = await setTimes({
			player,
		});
		time.textContent = dateString;
		startTime.textContent = startDateString;
		duration.textContent = durationString;

		row.appendChild(rank);
		row.appendChild(username);
		row.appendChild(points);
		row.appendChild(startTime);
		row.appendChild(time);
		row.appendChild(duration);

		rankingTableBody.appendChild(row);
	});

	setTimeout(() => {
		window.requestAnimationFrame(getRanking);
	}, 1000);
}

async function setTimes({ player }) {
	// convert time to hour minutes and seconds
	const date = new Date(player.time);
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const dateString = `${hours}:${minutes}:${seconds}`;

	// convert start time to hour minutes and seconds
	const startDate = new Date(player.startTime);
	const startHours = startDate.getHours();
	const startMinutes = startDate.getMinutes();
	const startSeconds = startDate.getSeconds();
	const startDateString = `${startHours}:${startMinutes}:${startSeconds}`;

	// calculate duration base on time and start time
	const durationDate = player.time - player.startTime;
	let durationHours = Math.floor(durationDate / 3600000);
	let durationMinutes = Math.floor((durationDate % 3600000) / 60000);
	let durationSeconds = Math.floor((durationDate % 60000) / 1000);
	durationHours = durationHours < 0 ? '00' : durationHours;
	durationMinutes = durationMinutes < 0 ? '00' : durationMinutes;
	durationSeconds = durationSeconds < 0 ? '00' : durationSeconds;
	const durationString = `${durationHours}:${durationMinutes}:${durationSeconds}`;

	return { dateString, startDateString, durationString };
}

getRanking();
