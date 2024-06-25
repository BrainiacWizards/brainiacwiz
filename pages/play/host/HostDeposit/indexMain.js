import { metaConnection } from "../../../../assets/js/utils/metamask.js";

// Function to send a transaction
async function sendTransaction(recipientAddress) {
    const address = await metaConnection();
    try {
        // Set the transaction parameters
        const transactionParameters = {
            from: address, // must match user's active address.
            to: "0x1fCe47Dc0e0211e17ac8CE7e03300c966556D16d", // Required except during contract publications.        
            value: '0x0', // Only required to send ether to the recipient from the initiating external account.
        };

        const depositAmountElement = document.getElementById('depositAmount');
        const amountValue = depositAmountElement ? depositAmountElement.value : '';
        const amount = /^[0-9]*\.?[0-9]+$/.test(amountValue) ? parseFloat(amountValue) : 0;
        if (amount > 0) {
            transactionParameters.value = '0x' + (amount * Math.pow(10, 18)).toString(16); // Convert to wei
        } else {
            alert('Please enter a valid amount');
            return;
        }

        // Estimate gas fees for the transaction
        const estimatedGas = await estimateGasFee(transactionParameters);
        transactionParameters.gasLimit = estimatedGas;

        // Send the transaction
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });

        console.log('Transaction sent:', txHash);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

// Function to estimate gas fees
async function estimateGasFee(transactionParameters) {
    try {
        const gasEstimate = await ethereum.request({
            method: 'eth_estimateGas',
            params: [transactionParameters],
        });
        return gasEstimate;
    } catch (error) {
        console.error('Error estimating gas:', error);
        throw error; // Propagate the error
    }
}

// Function to get the user's address and display balance
async function getAddress() {
    const address = await metaConnection();
    try {
        const balance = await ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest'],
        });

        const test = document.getElementById('hostBalance');
        const balanceInDecimal = parseInt(balance) / Math.pow(10, 18);
        test.value = balanceInDecimal;
        console.log(test);
    } catch (error) {
        console.error('Error getting address or balance:', error);
    }
}

// Call getAddress to display balance
getAddress();

// Attach click event handler to depositBtn
document.getElementById('depositBtn').onclick = function() {
    sendTransaction();
    console.log('depositBtn clicked');
};