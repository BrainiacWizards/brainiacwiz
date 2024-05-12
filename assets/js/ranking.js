import { getOverallRanking } from '../../pages/auth/fb.js';

// ranking table
const rankingTableBody = document.querySelector('#ranking-body');

// get the overall ranking
async function getRanking() {
	const overallRanking = await getOverallRanking();
	// clear the table
	rankingTableBody.innerHTML = '';

	// sort the ranking by time latest to oldest
	let sortedRanking = overallRanking.sort((a, b) => b.points - a.points);

	// create the ranking table
	sortedRanking.forEach((player, index) => {
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

		// convert time to hour minutes and seconds
		const date = new Date(player.time);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		time.textContent = `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

		// convert start time to hour minutes and seconds
		const startDate = new Date(player.startTime);
		const startHours = startDate.getHours();
		const startMinutes = startDate.getMinutes();
		const startSeconds = startDate.getSeconds();
		startTime.textContent = `${startHours
			.toString()
			.padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}:${startSeconds
			.toString()
			.padStart(2, '0')}`;

		// convert duration to hour minutes and seconds
		const durationDate = new Date(player.time - player.startTime);
		const durationHours = durationDate.getHours();
		const durationMinutes = durationDate.getMinutes();
		const durationSeconds = durationDate.getSeconds();
		duration.textContent = `${durationHours
			.toString()
			.padStart(2, '0')}:${durationMinutes
			.toString()
			.padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;

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

getRanking();
