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
            // gasLimit: '0x5028', // used for estimating gas.
            // maxPriorityFeePerGas: '0x3b9aca00', // used for agreeing the priority fee.
            // maxFeePerGas: '0x2540be400', // used for agreeing the max fee.
        };

        const amount = parseFloat(document.getElementById('depositAmount').value);
        if (amount > 0) {
            transactionParameters.value = amount.toString();
        } else {
            alert('Please enter a valid amount');
        }
        // Send the transaction'

        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });

        console.log('Transaction sent:', txHash);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

// Call the getRecipientAddress function to get the recipient's address and send the transaction
//getRecipientAddress();

async function getAddress() {
    const address = await metaConnection();
    // Get the balance of the user's MetaMask account
    const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
    });

    const test = document.getElementById('hostBalance');
    const balanceInDecimal = parseInt(balance)/Math.pow(10, 18);
    test.value = balanceInDecimal;
    console.log(test);
}
getAddress();

document.getElementById('depositBtn').onclick = function() {
    sendTransaction();
    console.log('depositBtn clicked');
};