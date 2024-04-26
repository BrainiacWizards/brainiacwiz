// ***************************************//
import { analytics, perf } from '../../../fb_config.js';
import { getTransfers } from './graph_query.js';
import { getState, metaConnection } from './metamask.js';

console.log('performance', perf);
console.log('analytics', analytics);

class Navbar {
	constructor() {
		this.injectWalletContainer();
		this.injectTrackingData();
		this.initDOMElements();
		this.injectCopyToClipboard();
		this.url =
			'https://api.studio.thegraph.com/query/72281/celo-subgraph-box/version/latest';
	}

	initDOMElements() {
		const selectors = {
			walletAddress: '#wallet-address-val',
			walletBtn: '.wallet-btn',
			walletNfts: '.wallet-nfts',
			walletContainer: '.wallet-container',
			closeWalletBtn: '#close-wallet',
			txItems: '.tx-items',
			collectionBtn: '#collection-btn',
			transactionBtn: '#transaction-btn',
			walletContent: '.wallet-content',
			txContent: '.tx-content',
			walletAddressCont: '.wallet-address',
		};
		Object.keys(selectors).forEach((key) => {
			this[key] = document.querySelector(selectors[key]);
		});
	}

	injectWalletContainer() {
		const walletContainerHTML = `
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
		document.body.insertAdjacentHTML('afterbegin', walletContainerHTML);
	}

	setNavbar() {
		metaConnection(this.walletAddress, 1);
		this.addEventListeners();
	}

	addEventListeners() {
		const toggleDisplay = (showElement, hideElement, activeBtn, inactiveBtn) => {
			showElement.style.display = 'flex';
			hideElement.style.display = 'none';
			activeBtn.classList.add('btn-active');
			inactiveBtn.classList.remove('btn-active');
		};

		this.walletBtn?.addEventListener('click', async () => {
			this.walletContainer.style.display = 'flex';
			this.showCollectedTokens();
			await this.showTransfers();
		});

		this.closeWalletBtn?.addEventListener('click', () => {
			this.walletContainer.style.display = 'none';
			this.walletContent.style.display = 'none';
			this.txContent.style.display = 'none';
			this.collectionBtn.classList.remove('btn-active');
			this.transactionBtn.classList.remove('btn-active');
		});
		this.collectionBtn?.addEventListener('click', () =>
			toggleDisplay(
				this.walletContent,
				this.txContent,
				this.collectionBtn,
				this.transactionBtn,
			),
		);
		this.transactionBtn?.addEventListener('click', () =>
			toggleDisplay(
				this.txContent,
				this.walletContent,
				this.transactionBtn,
				this.collectionBtn,
			),
		);
	}

	showCollectedTokens() {
		this.collectionBtn.classList.add('btn-active');
		this.transactionBtn.classList.remove('btn-active');
		// display wallet container
		this.walletContainer.style.display = 'flex';
		const state = getState();
		const { tokenURI } = state;

		if (tokenURI.length === 0) {
			this.walletNfts.innerHTML = `<h2>No NFTs collected yet</h2>`;
			return this.walletNfts;
		}

		this.walletNfts.innerHTML = '';

		tokenURI.forEach((uri) => {
			// if url doesn't match the current url, replace it with the current url
			const { origin } = window.location;
			if (!uri.includes(origin)) {
				const nft = uri.split('/assets/nft/')[1];
				uri = `${origin}/assets/nft/${nft}`;
			}

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

		transfers.forEach((transfer) => {
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

	async injectTrackingData() {
		const googleAnalytics = `<!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-PV2XS36JE2"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
          gtag('config', 'G-PV2XS36JE2');
      </script>`;
		document.head.insertAdjacentHTML('beforeend', googleAnalytics);
	}

	// inject copy to clipboard functionality
	injectCopyToClipboard() {
		const copyBtn = `
							<button id="copy-btn"><i class="fas fa-copy"></i></button>`;
		this.walletAddressCont.insertAdjacentHTML('beforeend', copyBtn);

		this.copyToClipboard();
	}

	copyToClipboard() {
		const copyBtn = document.querySelector('#copy-btn');
		copyBtn.addEventListener('click', () => {
			try {
				navigator.clipboard.writeText(this.walletAddress.textContent);
				copyBtn.innerHTML = `<i class="fas fa-check"></i>`;
				setTimeout(() => {
					copyBtn.innerHTML = `<i class="fas fa-copy"></i>`;
				}, 1000);
			} catch (error) {
				alert('Failed to copy to clipboard');
				copyBtn.innerHTML = `<i class="fas fa-times"></i>`;
				setTimeout(() => {
					copyBtn.innerHTML = `<i class="fas fa-copy"></i>`;
				}, 1000);
			}
		});
	}
}

const navbar = new Navbar();
navbar.setNavbar();
navbar.showTransfers();

export default Navbar;
