// graphQL api url
const url =
	'https://api.studio.thegraph.com/query/72281/celo-subgraph-box/version/latest';

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
		console.log(data.data.transfers);
		return data.data.transfers;
	} catch (error) {
		throw new Error(error);
	}
}

export { getTransfers };
