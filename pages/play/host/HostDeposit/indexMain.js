let nfts = [];

function deposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    if (amount > 0) {
        document.getElementById('depositAmount').value = '';
    } else {
        alert('Please enter a valid amount');
    }
}

function addNFT() {
    const nftName = prompt('Enter NFT URL:');
    if (nftName) {
        nfts.push(nftName);
        updateNFTs();
    }
}

function updateNFTs() {
    const nftList = document.getElementById('nftList');
    nftList.innerHTML = '';
    nfts.forEach((nft, index) => {
        const li = document.createElement('ul');
        li.innerText = `NFT ${index + 1}: ${nft}`;
        nftList.appendChild(li);
    });
}