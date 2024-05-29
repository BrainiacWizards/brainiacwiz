

let balance = 0;
let history = [];
let nfts = [];

function updateBalance() {
    document.getElementById('balance').innerText = balance.toFixed(2);
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerText = `${item.type}:R${item.amount} ${item.to ? 'to ' + item.to : ''}`;
        historyList.appendChild(li);
    });
}

function updateNFTs() {
    const nftList = document.getElementById('nftList');
    nftList.innerHTML = '';
    nfts.forEach((nft, index) => {
        const li = document.createElement('li');
        li.innerText = `NFT ${index + 1}: ${nft}`;
        nftList.appendChild(li);
    });
}

function deposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    if (amount > 0) {
        balance += amount;
        history.push({ type: 'Deposit', amount: amount });
        updateBalance();
        updateHistory();
        document.getElementById('depositAmount').value = '';
    } else {
        alert('Please enter a valid amount');
    }
}

function transfer() {
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const to = document.getElementById('transferTo').value;
    if (amount > 0 && to) {
        if (amount <= balance) {
            balance -= amount;
            history.push({ type: 'Transfer', amount: amount, to: to });
            updateBalance();
            updateHistory();
            document.getElementById('transferAmount').value = '';
            document.getElementById('transferTo').value = '';
        } else {
            alert('Insufficient balance');
        }
    } else {
        alert('Please enter a valid amount and recipient');
    }
}

function addNFT() {
    const nftName = prompt('Enter NFT name:');
    if (nftName) {
        nfts.push(nftName);
        updateNFTs();
    }
}

// Initial updates
updateBalance();
updateHistory();
updateNFTs();
