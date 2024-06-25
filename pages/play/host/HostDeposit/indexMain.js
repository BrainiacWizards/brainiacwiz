import { metaConnection } from "../../../../assets/js/utils/metamask.js";

// Function to send a transaction
async function sendTransaction() {
    const address = await metaConnection();
    try {
        const recipientAddress = document.getElementById('receiverAddress').value;
        if (!recipientAddress) {
            alert('Please enter a valid recipient address');
            return;
        }

        // Set the transaction parameters
        const transactionParameters = {
            from: address, // must match user's active address.
            to: recipientAddress, // User-provided recipient address
            value: '0x0', // Only required to send ether to the recipient from the initiating external account.
        };

        const amount = parseFloat(document.getElementById('depositAmount').value);
        if (amount > 0) {
            transactionParameters.value = (amount * Math.pow(10, 18)).toString(16); // Convert amount to Wei
        } else {
            alert('Please enter a valid amount');
            return;
        }

        // Calculate gas fees
        const gasFee = await calculateGasFee(transactionParameters);
        console.log('Estimated gas fee:', gasFee);

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
        console.error('Error calculating gas fee:', error);
        return null;
    }
}

// Function to get and display the user's MetaMask address and balance
async function getAddress() {
    const address = await metaConnection();
    // Get the balance of the user's MetaMask account
    const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
    });

    const balanceElement = document.getElementById('hostBalance');
    const balanceInDecimal = parseInt(balance) / Math.pow(10, 18);
    balanceElement.value = balanceInDecimal;
    console.log('User balance:', balanceElement.value);
}
getAddress();

// Event listener for the deposit button
document.getElementById('depositBtn').onclick = function() {
    sendTransaction();
    console.log('depositBtn clicked');
};
