const state = {
	account: '0x0',
	token: null,
	tokenURI: [],
	address: null,
	networkId: null,
	totalSupply: null,
};
// set the nft token images
const nfts = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];

async function loadContract(web3) {
	// get the contract data
	const originURL = window.location.origin;
	const response = await fetch(`${originURL}/abis/MemoryToken.json`);
	const data = await response.json();
	const networkId = await web3.eth.net.getId();
	const network = data.networks[networkId];

	if (!network) {
		alert(
			'Contract not deployed to the current network. Please select another network with Metamask.',
		);
		return;
	}

	const abi = data.abi;
	const address = network.address;
	const token = new web3.eth.Contract(abi, address);
	const totalSupply = await token.methods.totalSupply().call();

	// set state object
	state.token = token;
	state.address = address;
	state.networkId = networkId;
	state.totalSupply = totalSupply;

	const balanceOf = await token.methods.balanceOf(state.account).call();
	for (let i = 0; i < balanceOf; i++) {
		const id = await token.methods.tokenOfOwnerByIndex(state.account, i).call();
		let tokenURI = await token.methods.tokenURI(id).call();
		state.tokenURI = [...state.tokenURI, tokenURI];
	}

	console.log('state: ', state);

	return token;
}

async function metaConnection(walletAddress) {
	let web3;

	if (typeof window.ethereum !== 'undefined') {
		console.log('MetaMask is installed!');
		web3 = new Web3(window.ethereum);

		// prompt user to connect to metamask
		try {
			await window.ethereum.enable();
			console.log('metamask connected');
		} catch (error) {
			alert('You need to connect to MetaMask for this dApp to work!');
		}

		const accounts = await web3.eth.getAccounts();
		state.account = accounts[0];

		// load contract
		await loadContract(web3);

		if (walletAddress) walletAddress.innerHTML = state.account;
	} else {
		alert(
			'MetaMask is not installed. You will need it to interact with Ethereum.',
		);
	}
}

async function fundAccount() {
	let transferStatus = false;

	// randomly select an nft
	const randomIndex = Math.floor(Math.random() * nfts.length);
	const nft = nfts[randomIndex];

	// set the tokenURI
	const originURL = window.location.origin;
	const nftLink = `${originURL}/assets/nft/${nft}`;

	await state.token.methods
		.mint(state.account, nftLink)
		.send({ from: state.account })
		.on('transactionHash', (hash) => {
			console.log('transactionHash', hash);
			state.tokenURI = [...state.tokenURI, nftLink];
			transferStatus = true;
		})
		.on('confirmation', (confirmationNumber, receipt) => {
			console.log('confirmation', confirmationNumber, receipt);
			transferStatus = true;
		})
		.on('receipt', (receipt) => {
			console.log('receipt', receipt);
			transferStatus = true;
		})
		.on('error', (error, receipt) => {
			console.error('error', error, receipt);
			transferStatus = false;
		});

	return transferStatus;
}

// export state
function getState() {
	return state;
}

// export
export { metaConnection, fundAccount, getState };
