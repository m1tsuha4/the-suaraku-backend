var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  const proposalNames = [
    web3.utils.asciiToHex("Proposal 1"),
    web3.utils.asciiToHex("Proposal 2"),
];
deployer.deploy(Voting, proposalNames);
};
