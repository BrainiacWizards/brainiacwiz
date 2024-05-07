// import openai from 'openai' using cdn;
const OpenAI = require("openai");
const api = {
  apiKey: "",
};

const openai = new OpenAI(api);

async function main() {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "a white siamese cat",
    n: 1,
    size: "1024x1024",
  });
  image_url = response.data[0].url;

  console.log(image_url);
}

main();
