// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Voting
 * @dev Implements voting process along with vote delegation
 */
contract Voting {
    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    struct VoteHistory {
        address voterAddress; // address of the voter
        uint proposal; // index of the voted proposal
        uint timestamp; // time of the vote
    }

    address public chairperson;
    mapping(address => Voter) public voters;
    Proposal[] public proposals;
    mapping(address => VoteHistory[]) public voteHistories; // Mapping to store voting history
    uint public totalVotes; // Counter for total votes

    /** 
     * @dev Create a new ballot to choose one of 'proposalNames'.
     * @param proposalNames names of proposals
     */
    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function giveRightToVote(address voter) external {
        require(msg.sender == chairperson, "Only chairperson can give right to vote.");
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0, "Voter already has the right to vote.");
        voters[voter].weight = 1;
    }

    function delegate(address to) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "You have no right to vote");
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }

        Voter storage delegate_ = voters[to];
        require(delegate_.weight >= 1, "Delegate must have voting rights.");

        sender.voted = true;
        sender.delegate = to;

        if (delegate_.voted) {
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }

    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
        totalVotes += sender.weight; // Increment total votes

        // Store the voting history
        voteHistories[msg.sender].push(VoteHistory({
            voterAddress: msg.sender,
            proposal: proposal,
            timestamp: block.timestamp // Store the current block timestamp
        }));
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
        // Ensure that a valid proposal index is returned
        require(proposals.length > 0, "No proposals available");
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        uint winningProposalIndex = winningProposal(); // Get the winning proposal index
        require(winningProposalIndex < proposals.length, "Invalid proposal index"); // Ensure the index is valid
        winnerName_ = proposals[winningProposalIndex].name; // Access the name of the winning proposal
    }

    function hasRightToVote(address voter) public view returns (bool) {
        return voters[voter].weight > 0;
    }

    function hasVoted(address voter) public view returns (bool) {
        return voters[voter].voted;
    }

    // Function to get voting history for a specific voter
    function getVotingHistory(address voter) external view returns (VoteHistory[] memory) {
        return voteHistories[voter];
    }

    // Function to get the percentage of votes for each proposal
    function getVotePercentages() external view returns (uint[] memory) {
        uint[] memory percentages = new uint[](proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            if (totalVotes > 0) {
                percentages[i] = (proposals[i].voteCount * 100) / totalVotes; // Calculate percentage
            } else {
                percentages[i] = 0; // No votes cast
            }
        }
        return percentages;
    }
}
