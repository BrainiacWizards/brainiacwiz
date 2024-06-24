// import { query } from "../api/api.js";

const state = {
	account: '0x0',
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
		alert(
			//'Contract not deployed to the current network. Please select another network with Metamask.',
			'Almost there!!......Add Celo Testnet to your Metamask and also add free tokens.',
		);
		//window.location.href = 'https://faucet.celo.org/alfajores';
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
		state.tokenURI.push(tokenURI); // Simplified
	}

	console.log('state: ', state);

	return token;
}

async function metaConnection(walletAddress) {
	let web3;

	if (window.ethereum) {
		console.log('MetaMask is installed!');
		web3 = new Web3(window.ethereum);

		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			console.log('metamask connected');
		} catch (error) {
			alert('You need to connect to MetaMask for this dApp to work!!');
			window.location.href = '../../../pages/walletAuth/walletDirect.html'; // Redirecting to wallet authentication page for game access
			throw new Error('User denied account access, metamask not connected');
		}

		const accounts = await web3.eth.getAccounts();
		state.account = accounts[0];
		await loadContract(web3);

		if (walletAddress) {
			walletAddress.innerHTML = state.account;
		}
	} else {
		alert('No Web3 Provider detected. Please install Metamask.');
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
	// const nftLink = await query({ "inputs": "nft programming" })
	console.log('nftLink', nftLink);

	await state.token.methods
		.mint(state.account, nftLink)
		.send({ from: state.account })
		.on('receipt', (receipt) => {
			console.log('receipt', receipt);
			state.tokenURI.push(nftLink); // Simplified
			transferStatus = true;
		})
		.on('error', (error, receipt) => {
			console.error('error', error, receipt);
			transferStatus = false;
		});

	return transferStatus;
}

function getState() {
	return state;
}

export { metaConnection, fundAccount, getState };
