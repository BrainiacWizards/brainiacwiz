import ErrorDetection from './error.js';
import { getTransfers } from './graph_query.js';
import { getState, metaConnection } from './metamask.js';

class Navbar {
	constructor() {
		this.origin = window.location.origin;
		this.checkInternetConnection();
		this.injectWalletContainer();
		this.injectTrackingData();
		this.initDOMElements();
		this.injectCopyToClipboard();
		this.injectProfileLink();
		this.url = 'https://api.studio.thegraph.com/query/72281/celo-subgraph-box/version/latest';
		this.sentryUrl = ``;
		this.errorDetection = new ErrorDetection();
	}

	// inject profile link page next to wallet-btn
	injectProfileLink() {
		const profileLink = document.createElement('a');
		profileLink.href = `${this.origin}/pages/user/profile.html`;
		profileLink.classList.add('profile-link');
		profileLink.innerHTML = `<i class="fas fa-user"></i>`;
		this.walletBtn.insertAdjacentElement('afterend', profileLink);
		this.walletBtn.style.display = 'none';
	}

	checkInternetConnection() {
		const offlineMessage = document.createElement('div');
		offlineMessage.classList.add('offline-div');
		document.body.appendChild(offlineMessage);

		window.addEventListener('offline', () => {
			console.log('offline');
			offlineMessage.innerHTML = `
				<h1>Internet Connection Lost</h1>
				<br>
				<p>You might have to reload the page.</p>
				`;
			offlineMessage.style.display = 'flex';
		});

		if (!navigator.onLine) {
			offlineMessage.innerHTML = `
				<h1>Internet Connection Lost</h1>
				<br>
				<p>You might have to reload the page.</p>
				`;
			offlineMessage.style.display = 'flex';
		}

		window.addEventListener('online', () => {
			console.log('online');
			offlineMessage.innerHTML = `<h1>Connection is back on.</h1>`;
			setTimeout(() => {
				offlineMessage.style.display = 'none';
			}, 1500);
		});
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

	async setNavbar() {
		const caller = import.meta.url;
		await metaConnection(this.walletAddress, 1, caller);
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
			this.showTransfers();
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
		this.walletContainer.style.display = 'flex';
		const state = getState();
		const { tokenURI } = state;

		if (tokenURI.length === 0) {
			this.walletNfts.innerHTML = `<h2>No NFTs collected yet</h2>`;
			return this.walletNfts;
		}

		this.walletNfts.innerHTML = '';

		tokenURI.forEach((uri) => {
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
		console.log('showing transactions');

		transfers.forEach((transfer) => {
			if (transfer.to.toLowerCase() == state.account.toLowerCase()) {
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

		// start sentry transaction
		const sentry = document.createElement('script');
		sentry.src = `https://js.sentry-cdn.com/28e0779f6d4ee26fe0de02fcc3239280.min.js`;
		sentry.crossOrigin = 'anonymous';
		document.head.appendChild(sentry);

		// sentry tracking
		const sentryTracking = `<!-- Sentry.io tracking -->
	  	<script>
			Sentry.onLoad(function() {
				Sentry.init({
				// Performance Monitoring
				tracesSampleRate: 1.0,
				// Session Replay
				replaysSessionSampleRate: 0.1, 
				replaysOnErrorSampleRate: 1.0, 
				});
			});
		</script>`;

		document.head.insertAdjacentHTML('beforeend', sentryTracking);
	}

	// inject copy to clipboard functionality
	injectCopyToClipboard() {
		const copyBtn = `<button id="copy-btn"><i class="fas fa-copy"></i></button>`;
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
				this.errorDetection.consoleError(error.message);
				setTimeout(() => {
					copyBtn.innerHTML = `<i class="fas fa-copy"></i>`;
				}, 1000);
			}
		});
	}
}

const navbar = new Navbar();
navbar.setNavbar();

export default Navbar;
export { navbar };
