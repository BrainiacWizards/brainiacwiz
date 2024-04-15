const GameFunding = artifacts.require('GameFunding');

contract('GameFunding', (accounts) => {
	it('should fund account', async () => {
		const gameFundingInstance = await GameFunding.deployed();
		const accountStartingBalance = await web3.eth.getBalance(accounts[1]);
		await gameFundingInstance.fundAccount(accounts[1], {
			from: accounts[0],
			value: web3.utils.toWei('1', 'ether'),
		});
		const accountEndingBalance = await web3.eth.getBalance(accounts[1]);
		assert.equal(
			accountEndingBalance,
			accountStartingBalance + web3.utils.toWei('1', 'ether'),
			"Amount wasn't correctly sent to the receiver",
		);
	});
});
