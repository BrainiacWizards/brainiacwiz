const Quiz = artifacts.require('Quiz');
const Token = artifacts.require('Token');

module.exports = async function (deployer) {
	await deployer.deploy(Token);
	const token = await Token.deployed();

	await deployer.deploy(Quiz, token.address);
};
