import { navbar } from './setnavbar.js';

// get the token transfers from the graph
async function getTransfers({ state, url }) {
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: `
         {
          transfers(
										orderBy: tokenId
										orderDirection: desc
										)
          {
												tokenId
												from
												to
												transactionHash
												blockTimestamp
												blockNumber
          }
         }
         `,
			}),
		});

		const data = await res.json();
		return data.data.transfers;
	} catch (error) {
		navbar.errorDetection.consoleError(error.message);
		throw new Error(error);
	}
}

export { getTransfers };
