import { uploadImage } from '../../../pages/auth/fb.js';
import OpenAI from 'https://cdn.jsdelivr.net/npm/openai@4.47.3/index.js';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_TOKEN || '',
	organization: 'org-8TACu73kPyfhLEVkXetGPjTR',
	project: 'proj_n87YO6ztMzhlOQFdDv0WE9ka',
	dangerouslyAllowBrowser: true,
});

async function main() {
	const image = await openai.images.generate({
		prompt: 'an NFT of a anime and unrealistic brain with coin, and the work brainiacwiz on it',
	});

	console.log(image.data);

	const imageURL = image.data.url;
	try {
		const downloadURL = await uploadImage({ fileName: 'nftgen', imageURL, folder: 'nfts' });
		console.log(downloadURL);
	} catch (error) {
		console.log(`Error uploading image: ${error}`);
	}
}
main();
