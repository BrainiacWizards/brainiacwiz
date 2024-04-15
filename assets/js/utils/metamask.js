async function metaConnection(walletAddress) {
	let web3, userAccount;

	if (typeof window.ethereum !== 'undefined') {
		console.log('MetaMask is installed!');
		web3 = new Web3(window.ethereum);

		// promt user to connect to metamask
		try {
			await window.ethereum.enable();
			console.log('metamask connected');
		} catch (error) {
			console.log(error);
		}

		const accounts = await web3.eth.getAccounts();
		walletAddress.innerHTML = accounts[0];
		userAccount = accounts[0];
		console.log(accounts[0]);
	} else {
		alert(
			'MetaMask is not installed. You will need it to interact with Ethereum.',
		);
	}
}

async function fundAccount(userAccount) {
	const fundingAccountPrivateKey =
		'47bca25c5b3295958b43af2cc0d4d3ec0021037bda5a0f23467c7ef8ef29ee2e'; // Replace with your private key
	const fundingAccount = web3.eth.accounts.privateKeyToAccount(
		'0x' + fundingAccountPrivateKey,
	);
	web3.eth.accounts.wallet.add(fundingAccount);

	const playerAddress = userAccount;
	const amountToSend = web3.utils.toWei('0.01', 'ether'); // Change this to the amount you want to send

	const transactionParameters = {
		from: fundingAccount.address,
		to: userAccount,
		value: amountToSend,
		gas: '0xD05B', // 53000 in hexadecimal
	};

	console.log(transactionParameters);

	// Send the transaction
	web3.eth
		.sendTransaction(transactionParameters)
		.then((receipt) => console.log(receipt))
		.catch((error) => console.error(error));
}

// export
export { metaConnection, fundAccount };
