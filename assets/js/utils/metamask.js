import { navbar } from './setnavbar.js';

const state = {
	account: null,
	token: null,
	tokenURI: [],
	address: null,
	networkId: null,
	totalSupply: null,
};

const nfts = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];

async function loadContract(web3) {
	const { origin } = window.location;
	const response = await fetch(`${origin}/abis/MemoryToken.json`);
	const data = await response.json();
	const networkId = await web3.eth.net.getId();
	const network = data.networks[networkId];

	if (!network) {
		navbar.errorDetection.consoleError(
			'Contract not deployed to the current network, switch to CELO Testnet',
		);
		window.open('https://faucet.celo.org/alfajores', '_blank');
		return;
	}

	const { abi } = data;
	const { address } = network;
	const token = new web3.eth.Contract(abi, address);
	const totalSupply = await token.methods.totalSupply().call();

	state.token = token;
	state.address = address;
	state.networkId = networkId;
	state.totalSupply = totalSupply;

	const balanceOf = await token.methods.balanceOf(state.account).call();
	for (let i = 0; i < balanceOf; i++) {
		const id = await token.methods.tokenOfOwnerByIndex(state.account, i).call();
		let tokenURI = await token.methods.tokenURI(id).call();
		state.tokenURI.push(tokenURI);
	}

	console.log('state: ', state);
	navbar.errorDetection.consoleInfo('Contract Loaded...');
	return token;
}

async function metaConnection(walletAddress, n, caller) {
	// const callerPath = new Error().stack.match(/(file:\/\/\/.*:\d+:\d+)/)[1];
	// const callerFileName = callerPath.substring(callerPath.lastIndexOf('/') + 1);
	// console.log('Caller Path:', callerPath);
	// console.log('Caller File Name:', callerFileName);

	console.log('testing', caller);

	let web3;

	if (window.ethereum) {
		console.log('MetaMask is installed!');
		web3 = new Web3(window.ethereum);

		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			const accounts = await web3.eth.getAccounts();
			state.account = accounts[0];
			if (walletAddress) walletAddress.innerHTML = state.account;
		} catch (error) {
			navbar.errorDetection.consoleError('metamask not connected');
			await new Promise((resolve) => setTimeout(resolve, 2000));
			window.location.href = '../../../pages/walletAuth/walletDirect.html';
			throw new Error('User denied account access, metamask not connected');
		}

		await loadContract(web3);
	} else {
		navbar.errorDetection.consoleError('No Web3 Provider detected. Please install Metamask.');
		await new Promise((resolve) => setTimeout(resolve, 2000));
		window.location.href = '../../../pages/walletAuth/walletDirect.html';
		throw new Error('No Web3 Provider detected. Please install Metamask.');
	}

	return state.account;
}

async function fundAccount() {
	let transferStatus = false;
	const randomIndex = Math.floor(Math.random() * nfts.length);
	const nft = nfts[randomIndex];
	const { origin } = window.location;
	const nftLink = `${origin}/assets/nft/${nft}`;
	console.log('nftLink', nftLink);

	await state.token.methods
		.mint(state.account, nftLink)
		.send({ from: state.account })
		.on('receipt', (receipt) => {
			console.log('receipt', receipt);
			state.tokenURI.push(nftLink);
			transferStatus = true;
		})
		.on('error', (error, receipt) => {
			console.error('error', error, receipt);
			navbar.errorDetection.consoleError('Transaction failed:', receipt.status);
			transferStatus = false;
		});

	return transferStatus;
}

function getState() {
	return state;
}

export { metaConnection, fundAccount, getState };
