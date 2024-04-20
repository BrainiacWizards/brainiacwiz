import { getState, metaConnection } from './metamask.js';

class Navbar {
	constructor() {
		this.injectWalletContainer();
		this.walletAddress = document.querySelector('#wallet-address-val');
		this.walletBtn = document.querySelector('.wallet-btn');
		this.walletNfts = document.querySelector('.wallet-nfts');
		this.walletContainer = document.querySelector('.wallet-container');
		this.closeWalletBtn = document.querySelector('#close-wallet');
	}

	injectWalletContainer() {
		const walletContainer = `
			<!-- wallet-container -->
			<div class="wallet-container">
				<!-- show a list of collected nfts -->
				<div class="wallet-content">
					<div class="wallet-header">
						<h1>Wallet/Collections</h1>
						<span id="close-wallet">X</span>
					</div>
					<div class="wallet-body">
						<div class="wallet-nfts"> </div>
					</div>
				</div>
			</div>
		`;

		document.body.insertAdjacentHTML('afterbegin', walletContainer);
	}

	setNavbar() {
		metaConnection(this.walletAddress, 1);

		if (this.walletBtn) {
			this.walletBtn.addEventListener('click', () => this.showCollectedTokens());
		}

		if (this.closeWalletBtn) {
			this.closeWalletBtn.addEventListener('click', () => {
				this.walletContainer.style.display = 'none';
			});
		}
	}

	showCollectedTokens() {
		// display wallet container
		this.walletContainer.style.display = 'flex';
		const state = getState();
		const tokenURI = state.tokenURI;

		if (tokenURI.length === 0) {
			this.walletNfts.innerHTML = `<h1>No NFTs collected yet</h1>`;
			return this.walletNfts;
		}

		this.walletNfts.innerHTML = '';

		tokenURI.forEach((uri) => {
			this.walletNfts.innerHTML += `
                <div class="nft-card">
                    <img src="${uri}" alt="NFT" />
                </div>
                `;
		});

		return this.walletNfts;
	}
}

const navbar = new Navbar();
navbar.setNavbar();

export default Navbar;
