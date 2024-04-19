async function metaConnection(walletAddress, fund) {
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
		userAccount = accounts[0];

		if (walletAddress) walletAddress.innerHTML = accounts[0];

		if ((fund) => 1) {
			fundAccount(userAccount);
		}
	} else {
		alert(
			'MetaMask is not installed. You will need it to interact with Ethereum.',
		);
	}
}

async function fundAccount(userAccount) {
	// Create a web3 connection to a remote Ethereum node
	const web3 = new Web3('http://127.0.0.1:7545');

	// Set up the account that will send the transaction
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

	// Sign the transaction
	const signedTransaction = await web3.eth.accounts.signTransaction(
		transactionParameters,
		fundingAccount.privateKey,
	);

	// Send the transaction
	const receipt = await web3.eth.sendSignedTransaction(
		signedTransaction.rawTransaction,
	);

	alert('You just received 1 Eth, check your wallet!');
	console.log('Transaction receipt:', receipt);
}

// export
export { metaConnection, fundAccount };
