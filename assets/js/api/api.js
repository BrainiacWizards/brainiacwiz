
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
	return await host(url);

}

async function host(url){
	// host it on a free hosting link
	const response = await fetch("https://api.imgbb.com/1/upload", {
		method: "POST",
		body: JSON.stringify({ image: url, key: "YOUR_IMGBB_API_KEY" }),
	});

	return await response.json();

}

// export { query };

query({ text: "Fetch latest user data" }).then((data) => {
	console.log(data);
});
	console.log(url);
});