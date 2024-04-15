const Quiz = artifacts.require('Quiz');

module.exports = async function (deployer) {
	await deployer.deploy(Quiz);
};
