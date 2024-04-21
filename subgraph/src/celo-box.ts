import {
	Approval as ApprovalEvent,
	ApprovalForAll as ApprovalForAllEvent,
	Transfer as TransferEvent,
} from '../generated/CeloBox/CeloBox';
import { Token, TokenMetaData, User } from '../generated/schema';

const ipfshash = 'ipfs://';

export function handleTransfer(event: TransferEvent): void {
	let token = Token.load(event.params.tokenId.toString());
	if (!token) {
		token = new Token(event.params.tokenId.toString());
		token.tokenID = event.params.tokenId;

		token.tokenURI = '/' + event.params.tokenId.toString() + '.json';
		const tokenIpsfsHash = ipfshash + token.tokenURI;
		token.ipfsURI = tokenIpsfsHash;

		TokenMetaDataTemplate.create(tokenIpsfsHash);
	}

	token.updatedAtTimestamp = event.block.timestamp;
	token.owner = event.params.to;
	token.save();
}
