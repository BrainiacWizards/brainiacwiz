
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
	return result;
}
query({"inputs": "nft programming"}).then((response) => {
	// Use image
    const url = URL.createObjectURL(response);
    console.log(url);
    document.getElementById("image").src = url;
    console.log(document.getElementById("image").src);
}).catch((error) => console.error(error));


// use file system to convert url to image file 