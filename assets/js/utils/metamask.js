let token;
const state = {
	account: '0x0',
	token: null,
	tokenURI: [],
	address: null,
	networkId: null,
	totalSupply: null,
	nftWon: [],
};

async function loadContract(web3) {
	// get the contract data
	const response = await fetch('../../../abis/MemoryToken.json');
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

	console.log(state.token);
	console.log('address', state.address);
	console.log('networkId', state.networkId);
	console.log('totalSupply', state.totalSupply);
	console.log('tokenURI', state.tokenURI);

	return token;
}

async function metaConnection(walletAddress, fund) {
	let web3;

	if (typeof window.ethereum !== 'undefined') {
		console.log('MetaMask is installed!');
		web3 = new Web3(window.ethereum);

		// promt user to connect to metamask
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

		if ((fund) => 1) {
			// fundAccount();
		}
	} else {
		alert(
			'MetaMask is not installed. You will need it to interact with Ethereum.',
		);
	}
}

async function fundAccount() {
	state.token.methods
		.mint(state.account, 'http://127.0.0.1:5500/assets/nft/fries.png')
		.send({ from: state.account })
		.on('transactionHash', (hash) => {
			console.log('transactionHash', hash);
			state.tokenURI = [
				...state.tokenURI,
				'http://127.0.0.1:5500/assets/nft/fries.png',
			];
		})
		.on('confirmation', (confirmationNumber, receipt) => {
			console.log('confirmation', confirmationNumber, receipt);
		})
		.on('receipt', (receipt) => {
			console.log('receipt', receipt);
		})
		.on('error', (error, receipt) => {
			console.log('error', error, receipt);
		});
}

// export state
function getState() {
	return state;
}

// export
export { metaConnection, fundAccount, getState };
