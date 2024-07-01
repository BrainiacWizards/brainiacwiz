import { getState } from '../../../../assets/js/utils/metamask.js';
import { navbar } from '../../../../assets/js/utils/setnavbar.js';

const transfertext = document.getElementById('transfer-text');
const transferPop = document.getElementById('transfer-pop');
const closeBtn = document.querySelector('.close-btn');

// Event listener for the close button
closeBtn.addEventListener('click', () => {
	if (transferPop) transferPop.style.display = 'none';
});

// Function to send a transaction
async function sendTransaction() {
	const address = getState().account;
	transfertext.textContent = 'processing...';

	const recipientAddress = document.getElementById('receiverAddress').value;
	if (!recipientAddress || recipientAddress.trim() === '') {
		navbar.errorDetection.consoleError('Invalid recipient address!');
		return;
	}

	// Set the transaction parameters
	const transactionParameters = {
		from: address, // must match user's active address.
		to: recipientAddress, // User-provided recipient address
		value: '0x0', // Only required to send ether to the recipient from the initiating external account.
	};

	const depositAmountElement = document.getElementById('depositAmount');
	const amountValue = depositAmountElement ? depositAmountElement.value : '';
	const amount = /^[0-9]*\.?[0-9]+$/.test(amountValue) ? parseFloat(amountValue) : 0;

	if (amount > 0) {
		transactionParameters.value = '0x' + (amount * Math.pow(10, 18)).toString(16); // Convert to wei
	} else {
		navbar.errorDetection.consoleError('invalid amount!');
		transfertext.textContent = 'invalid Amount';
		return;
	}

	// Calculate gas fees
	const gasFee = await calculateGasFee(transactionParameters);
	console.log('Estimated gas fee:', gasFee);
	transfertext.textContent = `gasFee: ${gasFee}`;
	navbar.errorDetection.consoleInfo(`gasFee: ${gasFee}`);

	try {
		// Send the transaction
		transfertext.textContent = 'processing...';
		navbar.errorDetection.consoleInfo('processing transaction...');
		const txHash = await ethereum.request({
			method: 'eth_sendTransaction',
			params: [transactionParameters],
		});

		// delay for 10s
		transfertext.textContent = 'Waiting confirmation...';
		navbar.errorDetection.consoleInfo('Waiting for confirmation...');
		await new Promise((resolve) => setTimeout(resolve, 5000));

		// Get the transaction receipt
		const transactionReceipt = await ethereum.request({
			method: 'eth_getTransactionReceipt',
			params: [txHash],
		});

		if (transactionReceipt) {
			await getAddress();
			transfertext.textContent = 'Transaction confirmed';
			navbar.errorDetection.consoleInfo('Transaction confirmed');
		} else {
			transfertext.textContent = 'Transaction failed';
			navbar.errorDetection.consoleInfo('Transaction failed');
		}

		console.log('Transaction sent:', txHash);
	} catch (error) {
		console.error('Error sending transaction:', error);
		navbar.errorDetection.consoleError(error.data.message);
		transfertext.textContent = 'Transaction failed';
		return;
	}
}

// Function to calculate gas fee
async function calculateGasFee(transactionParameters) {
	try {
		// Get current gas price
		const gasPrice = await ethereum.request({
			method: 'eth_gasPrice',
		});

		// Estimate gas limit
		const gasLimit = await ethereum.request({
			method: 'eth_estimateGas',
			params: [transactionParameters],
		});

		return (parseInt(gasPrice, 16) * parseInt(gasLimit, 16)) / Math.pow(10, 18);
	} catch (error) {
		transfertext.textContent = 'Error calculating gas fee';
		console.error('Error calculating gas fee:', error);
		navbar.errorDetection.consoleError(error.message);
		return null;
	}
}

// Function to get and display the user's MetaMask address and balance
async function getAddress() {
	const address = getState().account;
	// Get the balance of the user's MetaMask account
	try {
		const balance = await ethereum.request({
			method: 'eth_getBalance',
			params: [address, 'latest'],
		});

		const balanceElement = document.getElementById('hostBalance');
		const balanceInDecimal = (balance / 10 ** 18).toFixed(8);
		balanceElement.value = balanceInDecimal;
		console.log('User balance:', balanceElement.value);
	} catch (error) {
		navbar.errorDetection.consoleError(error.message);
	}
}

// Call getAddress to display balance
getAddress();

// Event listener for the deposit button
document.getElementById('depositBtn').onclick = function () {
	sendTransaction();
	console.log('depositBtn clicked');
};
