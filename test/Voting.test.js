const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
    let voting;
    const chairperson = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    beforeEach(async () => {
        const proposalNames = [
            web3.utils.asciiToHex("Proposal 1"),
            web3.utils.asciiToHex("Proposal 2")
        ]; // Convert strings to bytes32
        voting = await Voting.new(proposalNames);
    });

    it("should allow chairperson to give right to vote", async () => {
        await voting.giveRightToVote(voter1, { from: chairperson });
        const voter = await voting.voters(voter1);
        assert.equal(voter.weight.toString(), '1', "Voter should have weight of 1");
    });

    it("should not allow non-chairperson to give right to vote", async () => {
        try {
            await voting.giveRightToVote(voter1, { from: voter2 });
            assert.fail("Expected error not received");
        } catch (error) {
            assert(error.message.includes("Only chairperson can give right to vote"), "Error message should contain 'Only chairperson can give right to vote'");
        }
    });

    it("should allow a voter to vote", async () => {
        await voting.giveRightToVote(voter1, { from: chairperson });
        await voting.vote(0, { from: voter1 });
        const proposal = await voting.proposals(0);
        assert.equal(proposal.voteCount.toString(), '1', "Proposal 1 should have 1 vote");
    });

    it("should not allow a voter to vote twice", async () => {
        await voting.giveRightToVote(voter1, { from: chairperson });
        await voting.vote(0, { from: voter1 });
        try {
            await voting.vote(1, { from: voter1 });
            assert.fail("Expected error not received");
        } catch (error) {
            assert(error.message.includes("Already voted."), "Error message should contain 'Already voted.'");
        }
    });

    it("should return the winning proposal", async () => {
        await voting.giveRightToVote(voter1, { from: chairperson });
        await voting.vote(0, { from: voter1 }); // Voter 1 votes for Proposal 1
        await voting.giveRightToVote(voter2, { from: chairperson });
        await voting.vote(1, { from: voter2 }); // Voter 2 votes for Proposal 2
        const winner = await voting.winnerName();
        assert.equal(winner, web3.utils.asciiToHex("Proposal 2"), "Proposal 2 should be the winner");
    });
    
});
