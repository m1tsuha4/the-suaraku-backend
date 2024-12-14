const contract = require('truffle-contract');
const votingArtifact = require('../build/contracts/Voting.json');

const Voting = contract(votingArtifact);

module.exports = {
    start: function(web3, callback) {
        // Set the provider for the Voting contract
        Voting.setProvider(web3.currentProvider);

        // Get the initial account balance so it can be displayed.
        web3.eth.getAccounts((err, accs) => {
            if (err) {
                console.log("There was an error fetching your accounts:", err);
                return callback(err); // Pass the error to the callback
            }

            if (accs.length === 0) {
                console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return callback(new Error("No accounts available")); // Pass the error to the callback
            }

            this.accounts = accs;
            this.account = this.accounts[0]; // Set the default account (chairperson)

            console.log("ChairPerson Account : ", this.account);

            callback(null, this.accounts); // Pass accounts to the callback
        });
    },

    giveRightToVote: async function(web3, voterAddress) {
        const instance = await Voting.deployed();
        // const accounts = await web3.eth.getAccounts();
        const chairperson = this.accounts[0]; // Ensure this is defined

        try {
            await instance.giveRightToVote(voterAddress, { from: chairperson });
            return { message: `Voting rights granted to ${voterAddress}` };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to give right to vote');
        }
    },

    vote: async function(web3, proposalIndex, voterAddress) {
        const instance = await Voting.deployed();

        try {
            await instance.vote(proposalIndex, { from: voterAddress, gas: 3000000 } );
            return { message: `Voter ${voterAddress} voted for proposal ${proposalIndex}` };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to cast vote');
        }
    },

    winningProposal: async function() {
        const instance = await Voting.deployed();
        const winnerName = await instance.winnerName();
        console.log("Winning proposal name:", winnerName);

        if (winnerName ==="0x50726f706f73616c203100000000000000000000000000000000000000000000"){
            return { winner: "Proposal 1" };
        } else if (winnerName ==="0x50726f706f73616c203200000000000000000000000000000000000000000000") {
            return { winner: "Proposal 2" };
        }
    },

    hasRightToVote: async function (voterAddress) {
        const instance = await Voting.deployed();
        const hasRight = await instance.hasRightToVote(voterAddress);
        return({ hasRight });
    }
};
