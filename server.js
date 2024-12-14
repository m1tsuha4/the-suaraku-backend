const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const app = express();
const port = 3000;

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Adjust the provider if needed

// Import the app.js functions
const votingApp = require('./connection/app.js');

// Middleware
app.use(bodyParser.json());

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    votingApp.start(web3, (err, accounts) => {
        if (err) {
            console.error("Error starting app:", err);
            return;
        }
        console.log("Accounts available: ", accounts);
    });
});

// Endpoint to give right to vote
app.post('/giveRightToVote', async (req, res) => {
    const { voterAddress } = req.body;

    try {
        const result = await votingApp.giveRightToVote(web3, voterAddress);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to give right to vote' });
    }
});

// Endpoint to vote
app.post('/vote', async (req, res) => {
    const { proposalIndex, voterAddress } = req.body;

    console.log(proposalIndex, voterAddress);

    try {
        const result = await votingApp.vote(web3, proposalIndex, voterAddress);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to cast vote' });
    }
});

// Endpoint to get the winning proposal
app.get('/winningProposal', async (req, res) => {
    try {
        const result = await votingApp.winningProposal(web3);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve winning proposal' });
    }
});

app.get('/hasRightToVote/:voterAddress', async (req, res) => {
    const { voterAddress } = req.params;

    console.log(voterAddress);

    try {
        const result = await votingApp.hasRightToVote(web3, voterAddress);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to check voting rights' });
    }
});
