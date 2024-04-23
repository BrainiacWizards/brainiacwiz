import { getTransfers } from './graph_query.js';
import { getState, metaConnection } from './metamask.js';

class Navbar {
	constructor() {
		this.injectWalletContainer();
		this.walletAddress = document.querySelector('#wallet-address-val');
		this.walletBtn = document.querySelector('.wallet-btn');
		this.walletNfts = document.querySelector('.wallet-nfts');
		this.walletContainer = document.querySelector('.wallet-container');
		this.closeWalletBtn = document.querySelector('#close-wallet');
		this.txItems = document.querySelector('.tx-items');
		this.url =
			'https://api.studio.thegraph.com/query/72281/celo-subgraph-box/version/latest';
		this.collectionBtn = document.querySelector('#collection-btn');
		this.transactionBtn = document.querySelector('#transaction-btn');
		this.walletContent = document.querySelector('.wallet-content');
		this.txContent = document.querySelector('.tx-content');
	}

	injectWalletContainer() {
		const walletContainer = `
			<!-- wallet-container -->
			<div class="wallet-container">
				<div class="wallet-options">
					<button id="collection-btn">NFT Collection</button>
					<button id="transaction-btn">Transactions</button>
					<span class="close-on-wallet" id="close-wallet"
						><i class="fa-regular fa-circle-xmark"></i
					></span>
				</div>

				<!-- show a list of collected nfts -->
				<div class="wallet-content">
					<div class="wallet-header">
						<h1>My NFT Collection</h1>
					</div>
					<div class="wallet-body">
						<div class="wallet-nfts"> </div>
					</div>
				</div>

				<!-- show user transactions -->
				<div class="tx-content">
					<div class="tx-header">
						<h1>My Transactions</h1>
					</div>
					<div class="tx-body">
						<!-- transaction table -->
						<ul class="tx-items"></ul>
					</div>
				</div>
			</div>
		`;

		document.body.insertAdjacentHTML('afterbegin', walletContainer);
	}

	setNavbar() {
		metaConnection(this.walletAddress, 1);

		if (this.walletBtn) {
			this.walletBtn.addEventListener('click', async () => {
				this.walletContainer.style.display = 'flex';
				this.showCollectedTokens();
				await this.showTransfers();
			});
		}

		if (this.closeWalletBtn) {
			this.closeWalletBtn.addEventListener('click', () => {
				this.walletContainer.style.display = 'none';
			});
		}

		if (this.collectionBtn) {
			this.collectionBtn.addEventListener('click', () => {
				this.walletContent.style.display = 'flex';
				this.txContent.style.display = 'none';
				this.collectionBtn.classList.add('btn-active');
				this.transactionBtn.classList.remove('btn-active');
			});
		}

		if (this.transactionBtn) {
			this.transactionBtn.addEventListener('click', () => {
				this.walletContent.style.display = 'none';
				this.txContent.style.display = 'flex';
				this.transactionBtn.classList.add('btn-active');
				this.collectionBtn.classList.remove('btn-active');
			});
		}
	}

	showCollectedTokens() {
		this.collectionBtn.classList.add('btn-active');
		this.transactionBtn.classList.remove('btn-active');
		// display wallet container
		this.walletContainer.style.display = 'flex';
		const state = getState();
		const tokenURI = state.tokenURI;

		if (tokenURI.length === 0) {
			this.walletNfts.innerHTML = `<h2>No NFTs collected yet</h2>`;
			return this.walletNfts;
		}

		this.walletNfts.innerHTML = '';

		tokenURI.forEach((uri) => {
			// if url doesn't match the current url, replace it with the current url
			const origin = window.location.origin;
			if (!uri.includes(origin)) {
				const nft = uri.split('/assets/nft/')[1];
				uri = `${origin}/assets/nft/${nft}`;
			}

			console.log(uri);

			this.walletNfts.innerHTML += `
                <div class="nft-card">
                    <img src="${uri}" alt="NFT" />
                </div>
                `;
		});

		return this.walletNfts;
	}

	async showTransfers() {
		const state = getState();
		let transfers = await getTransfers({ state, url: this.url });
		this.txItems.innerHTML = '';

		//get transfers from the current wallet
		console.warn(transfers);

		transfers.forEach((transfer) => {
			//filter out transfers that are not from the current wallet
			console.log(transfer.to, state.account);
			if (transfer.to.toLowerCase() == state.account.toLowerCase()) {
				//get timestamp and convert to date and time
				const date = new Date(transfer.blockTimestamp * 1000);
				transfer.blockTimestamp = date.toLocaleString();

				this.txItems.innerHTML += `
				<li class="tx-item">
					<span><p class="tx-item-p">TokenID: </p>${transfer.tokenId}</span>
					<span><p class="tx-item-p">TxHash: </p>${transfer.transactionHash}</span>
					<span><p class="tx-item-p">From: </p>${transfer.from}</span>
					<span><p class="tx-item-p">To: </p>${transfer.to}</span>
					<span><p class="tx-item-p">Date: </p>${transfer.blockTimestamp}</span>
					<span><p class="tx-item-p">Block No: </p>${transfer.blockNumber}</span>
				</li>`;
			}
		});
	}
}

const navbar = new Navbar();
navbar.setNavbar();
navbar.showTransfers();

export default Navbar;
