import { getOverallRanking } from '../../pages/auth/fb.js';
const rankingTableBody = document.querySelector('#ranking-body');
import { checkLoginStatus } from './main.js';
checkLoginStatus({ path: '../auth/' });

// get the overall ranking
async function getRanking() {
	const overallRanking = await getOverallRanking();
	rankingTableBody.innerHTML = '';

	// sort the ranking by time latest to oldest
	let sortedRanking = overallRanking.sort((a, b) => b.points - a.points);

	// group the rankings by gamePin
	const rankingByGamePin = {};
	sortedRanking.forEach((player) => {
		if (player.campaign) {
			player.gamePin = player.campaign;
		}
		if (!rankingByGamePin[player.gamePin]) {
			rankingByGamePin[player.gamePin] = [];
		}
		rankingByGamePin[player.gamePin].push(player);
	});

	// create the ranking table for each gamePin
	Object.keys(rankingByGamePin).forEach(async (gamePin) => {
		const players = rankingByGamePin[gamePin];
		const gamePinRow = document.createElement('tr');
		gamePinRow.innerHTML = `
			<td colspan="6" class="game-pin-col">${gamePin}</td>
		`;

		let group = [gamePinRow];

		await players.forEach(async (player, index) => {
			const { dateString, startDateString, durationString } = await setTimes({ player });
			const playerRow = document.createElement('tr');
			playerRow.innerHTML = `
				<td>${index + 1}</td>
				<td>${player.username}</td>
				<td>${player.points}</td>
				<td>${startDateString}</td>
				<td>${dateString}</td>
				<td>${durationString}</td>
			`;

			group.push(playerRow);
		});

		rankingTableBody.append(...group);
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
