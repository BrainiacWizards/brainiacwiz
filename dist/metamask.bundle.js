(()=>{"use strict";var t={712:(t,e,n)=>{n.d(e,{A:()=>s});const s=class{constructor(){this.injectErrorBlock(),this.trackErrors()}injectErrorBlock(){this.errorBlock=document.createElement("div"),this.errorBlock.classList.add("error-block"),document.body.appendChild(this.errorBlock)}errorElementConstructor({message:t,type:e}){const n=document.createElement("div");n.setAttribute("data-date",new Date),n.classList.add("error-container",e);const s=document.createElement("div");s.classList.add("error-element",e);const o=document.createElement("i");"error"===e&&o.classList.add("fas","fa-exclamation-circle"),"warning"===e&&o.classList.add("fas","fa-exclamation-triangle"),"info"===e&&o.classList.add("fas","fa-info-circle");const a=document.createElement("span");a.classList.add("error-message"),a.textContent=t;const i=document.createElement("button");i.classList.add("error-close-btn"),i.textContent="X";const r=document.createElement("div");r.classList.add("expiry-block");const l=document.createElement("span");return l.classList.add("expiry-span"),r.appendChild(l),s.appendChild(o),s.appendChild(a),s.appendChild(i),n.appendChild(s),n.appendChild(r),i.addEventListener("click",(()=>{n.remove()})),n}consoleError=t=>{this.errorBlock.style.display="grid",this.errorBlock.appendChild(this.errorElementConstructor({message:t,type:"error"})),console.error(t)};consoleWarn=t=>{this.errorBlock.style.display="grid",this.errorBlock.appendChild(this.errorElementConstructor({message:t,type:"warning"})),console.warn(t)};consoleInfo=t=>{this.errorBlock.style.display="grid",this.errorBlock.appendChild(this.errorElementConstructor({message:t,type:"info"})),console.info(t)};trackErrors(){const t=document.querySelectorAll(".error-container");t.forEach((t=>{const e=new Date(t.getAttribute("data-date")),n=new Date-e;let s=n/4e3*100;t.querySelector(".expiry-span").style.width=100-s+"%",n>4e3&&t.remove()})),0===t.length&&(this.errorBlock.style.display="none"),window.requestAnimationFrame((()=>this.trackErrors()))}}},271:(t,e,n)=>{n.d(e,{d:()=>o});var s=n(790);async function o({state:t,url:e}){try{const t=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:"\n         {\n          transfers(\n\t\t\t\t\t\t\t\t\t\torderBy: tokenId\n\t\t\t\t\t\t\t\t\t\torderDirection: desc\n\t\t\t\t\t\t\t\t\t\t)\n          {\n\t\t\t\t\t\t\t\t\t\t\t\ttokenId\n\t\t\t\t\t\t\t\t\t\t\t\tfrom\n\t\t\t\t\t\t\t\t\t\t\t\tto\n\t\t\t\t\t\t\t\t\t\t\t\ttransactionHash\n\t\t\t\t\t\t\t\t\t\t\t\tblockTimestamp\n\t\t\t\t\t\t\t\t\t\t\t\tblockNumber\n          }\n         }\n         "})});return(await t.json()).data.transfers}catch(t){throw s.v.errorDetection.consoleError(t.message),new Error(t)}}},387:(t,e,n)=>{n.d(e,{Gu:()=>i,I9:()=>a});var s=n(790);const o={account:null,token:null,tokenURI:[],address:null,networkId:null,totalSupply:null};async function a(t){let e;if(!window.ethereum)throw s.v.errorDetection.consoleError("No Web3 Provider detected. Please install Metamask."),await new Promise((t=>setTimeout(t,2e3))),window.location.href="../../../pages/walletAuth/walletDirect.html",new Error("No Web3 Provider detected. Please install Metamask.");console.log("MetaMask is installed!"),e=new Web3(window.ethereum);try{await window.ethereum.request({method:"eth_requestAccounts"});const n=await e.eth.getAccounts();o.account=n[0],t&&(t.innerHTML=o.account)}catch(t){throw s.v.errorDetection.consoleError("metamask not connected"),await new Promise((t=>setTimeout(t,2e3))),window.location.href="../../../pages/walletAuth/walletDirect.html",new Error("User denied account access, metamask not connected")}return await async function(t){const{origin:e}=window.location,n=await fetch(`${e}/abis/MemoryToken.json`),a=await n.json(),i=await t.eth.net.getId(),r=a.networks[i];if(!r)return s.v.errorDetection.consoleError("Contract not deployed to the current network, switch to CELO Testnet"),void window.open("https://faucet.celo.org/alfajores","_blank");const{abi:l}=a,{address:c}=r,d=new t.eth.Contract(l,c),h=await d.methods.totalSupply().call();o.token=d,o.address=c,o.networkId=i,o.totalSupply=h;const p=await d.methods.balanceOf(o.account).call();for(let t=0;t<p;t++){const e=await d.methods.tokenOfOwnerByIndex(o.account,t).call();let n=await d.methods.tokenURI(e).call();o.tokenURI.push(n)}return console.log("state: ",o),s.v.errorDetection.consoleInfo("Contract Loaded..."),d}(e),o.account}function i(){return o}},790:(t,e,n)=>{n.d(e,{v:()=>i});var s=n(712),o=n(271),a=n(387);const i=new class{constructor(){const{origin:t}=window.location;this.origin=t,this.checkInternetConnection(),this.injectWalletContainer(),this.injectTrackingData(),this.initDOMElements(),this.injectCopyToClipboard(),this.injectProfileLink(),this.url="https://api.studio.thegraph.com/query/72281/celo-subgraph-box/version/latest",this.sentryUrl="",this.errorDetection=new s.A}injectProfileLink(){const t=document.createElement("a");t.href=`${this.origin}/pages/user/profile.html`,t.classList.add("profile-link"),t.innerHTML='<i class="fas fa-user"></i>',this.walletBtn.insertAdjacentElement("afterend",t),this.walletBtn.style.display="none"}checkInternetConnection(){const t=document.createElement("div");t.classList.add("offline-div"),document.body.appendChild(t),window.addEventListener("offline",(()=>{console.log("offline"),t.innerHTML="\n\t\t\t\t<h1>Internet Connection Lost</h1>\n\t\t\t\t<br>\n\t\t\t\t<p>You might have to reload the page.</p>\n\t\t\t\t",t.style.display="flex"})),navigator.onLine||(t.innerHTML="\n\t\t\t\t<h1>Internet Connection Lost</h1>\n\t\t\t\t<br>\n\t\t\t\t<p>You might have to reload the page.</p>\n\t\t\t\t",t.style.display="flex"),window.addEventListener("online",(()=>{console.log("online"),t.innerHTML="<h1>Connection is back on.</h1>",setTimeout((()=>{t.style.display="none"}),1500)}))}initDOMElements(){const t={walletAddress:"#wallet-address-val",walletBtn:".wallet-btn",walletNfts:".wallet-nfts",walletContainer:".wallet-container",closeWalletBtn:"#close-wallet",txItems:".tx-items",collectionBtn:"#collection-btn",transactionBtn:"#transaction-btn",walletContent:".wallet-content",txContent:".tx-content",walletAddressCont:".wallet-address"};Object.keys(t).forEach((e=>{this[e]=document.querySelector(t[e])}))}injectWalletContainer(){document.body.insertAdjacentHTML("afterbegin",'\n\t\t\t\x3c!-- wallet-container --\x3e\n\t\t\t<div class="wallet-container">\n\t\t\t\t<div class="wallet-options">\n\t\t\t\t\t<button id="collection-btn">NFT Collection</button>\n\t\t\t\t\t<button id="transaction-btn">Transactions</button>\n\t\t\t\t\t<span class="close-on-wallet" id="close-wallet"\n\t\t\t\t\t\t><i class="fa-regular fa-circle-xmark"></i\n\t\t\t\t\t></span>\n\t\t\t\t</div>\n\n\t\t\t\t\x3c!-- show a list of collected nfts --\x3e\n\t\t\t\t<div class="wallet-content">\n\t\t\t\t\t<div class="wallet-header">\n\t\t\t\t\t\t<h1>My NFT Collection</h1>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="wallet-body">\n\t\t\t\t\t\t<div class="wallet-nfts"> </div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t\x3c!-- show user transactions --\x3e\n\t\t\t\t<div class="tx-content">\n\t\t\t\t\t<div class="tx-header">\n\t\t\t\t\t\t<h1>My Transactions</h1>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="tx-body">\n\t\t\t\t\t\t\x3c!-- transaction table --\x3e\n\t\t\t\t\t\t<ul class="tx-items"></ul>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t')}async setNavbar(){await(0,a.I9)(this.walletAddress,1),this.addEventListeners()}addEventListeners(){const t=(t,e,n,s)=>{t.style.display="flex",e.style.display="none",n.classList.add("btn-active"),s.classList.remove("btn-active")};this.walletBtn?.addEventListener("click",(async()=>{this.walletContainer.style.display="flex",this.showCollectedTokens(),this.showTransfers()})),this.closeWalletBtn?.addEventListener("click",(()=>{this.walletContainer.style.display="none",this.walletContent.style.display="none",this.txContent.style.display="none",this.collectionBtn.classList.remove("btn-active"),this.transactionBtn.classList.remove("btn-active")})),this.collectionBtn?.addEventListener("click",(()=>t(this.walletContent,this.txContent,this.collectionBtn,this.transactionBtn))),this.transactionBtn?.addEventListener("click",(()=>t(this.txContent,this.walletContent,this.transactionBtn,this.collectionBtn)))}showCollectedTokens(){this.collectionBtn.classList.add("btn-active"),this.transactionBtn.classList.remove("btn-active"),this.walletContainer.style.display="flex";const t=(0,a.Gu)(),{tokenURI:e}=t;return 0===e.length?(this.walletNfts.innerHTML="<h2>No NFTs collected yet</h2>",this.walletNfts):(this.walletNfts.innerHTML="",e.forEach((t=>{const{origin:e}=window.location;if(!t.includes(e)){const n=t.split("/assets/nft/")[1];t=`${e}/assets/nft/${n}`}this.walletNfts.innerHTML+=`\n          <div class="nft-card">\n              <img src="${t}" alt="NFT" />\n          </div>\n          `})),this.walletNfts)}async showTransfers(){const t=(0,a.Gu)();let e=await(0,o.d)({state:t,url:this.url});this.txItems.innerHTML="",console.log("showing transactions"),e.forEach((e=>{if(e.to.toLowerCase()==t.account.toLowerCase()){const t=new Date(1e3*e.blockTimestamp);e.blockTimestamp=t.toLocaleString(),this.txItems.innerHTML+=`\n\t\t\t\t<li class="tx-item">\n\t\t\t\t\t<span><p class="tx-item-p">TokenID: </p>${e.tokenId}</span>\n\t\t\t\t\t<span><p class="tx-item-p">TxHash: </p>${e.transactionHash}</span>\n\t\t\t\t\t<span><p class="tx-item-p">From: </p>${e.from}</span>\n\t\t\t\t\t<span><p class="tx-item-p">To: </p>${e.to}</span>\n\t\t\t\t\t<span><p class="tx-item-p">Date: </p>${e.blockTimestamp}</span>\n\t\t\t\t\t<span><p class="tx-item-p">Block No: </p>${e.blockNumber}</span>\n\t\t\t\t</li>`}}))}async injectTrackingData(){document.head.insertAdjacentHTML("beforeend","\x3c!-- Google tag (gtag.js) --\x3e\n      <script async src=\"https://www.googletagmanager.com/gtag/js?id=G-PV2XS36JE2\"><\/script>\n      <script>\n        window.dataLayer = window.dataLayer || [];\n        function gtag(){dataLayer.push(arguments);}\n        gtag('js', new Date());\n          gtag('config', 'G-PV2XS36JE2');\n      <\/script>");const t=document.createElement("script");t.src="https://js.sentry-cdn.com/28e0779f6d4ee26fe0de02fcc3239280.min.js",t.crossOrigin="anonymous",document.head.appendChild(t),document.head.insertAdjacentHTML("beforeend","\x3c!-- Sentry.io tracking --\x3e\n\t  \t<script>\n\t\t\tSentry.onLoad(function() {\n\t\t\t\tSentry.init({\n\t\t\t\t// Performance Monitoring\n\t\t\t\ttracesSampleRate: 1.0,\n\t\t\t\t// Session Replay\n\t\t\t\treplaysSessionSampleRate: 0.1, \n\t\t\t\treplaysOnErrorSampleRate: 1.0, \n\t\t\t\t});\n\t\t\t});\n\t\t<\/script>")}injectCopyToClipboard(){this.walletAddressCont.insertAdjacentHTML("beforeend",'<button id="copy-btn"><i class="fas fa-copy"></i></button>'),this.copyToClipboard()}copyToClipboard(){const t=document.querySelector("#copy-btn");t.addEventListener("click",(()=>{try{navigator.clipboard.writeText(this.walletAddress.textContent),t.innerHTML='<i class="fas fa-check"></i>',setTimeout((()=>{t.innerHTML='<i class="fas fa-copy"></i>'}),1e3)}catch(e){alert("Failed to copy to clipboard"),t.innerHTML='<i class="fas fa-times"></i>',this.errorDetection.consoleError(e.message),setTimeout((()=>{t.innerHTML='<i class="fas fa-copy"></i>'}),1e3)}}))}};i.setNavbar()}},e={};function n(s){var o=e[s];if(void 0!==o)return o.exports;var a=e[s]={exports:{}};return t[s](a,a.exports,n),a.exports}n.d=(t,e)=>{for(var s in e)n.o(e,s)&&!n.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n(387)})();