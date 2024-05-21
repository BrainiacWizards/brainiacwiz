
async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	const url = URL.createObjectURL(result);

	// host the link online and return the hostel url
	const hostUrl = await host(url);

	return hostUrl;
}

async function host(url){
	// host it on a free hosting link
	const response = await fetch("https://api.imgbb.com/1/upload", {
		method: "POST",
		body: JSON.stringify({ image: url, key: "YOUR_IMGBB_API_KEY" }),
	});

	const result = await response.json();
	return result;
}

// export { query };

query({ text: "Hello, I am a software developer" }).then((url) => {
	console.log(url);
});