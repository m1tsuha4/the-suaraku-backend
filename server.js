const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const app = express();
const port = 3000;
const sequelize = require('./database/database.js');
const User = require('./models/User');
const Partai = require('./models/Partai');
const Paslon = require('./models/Paslon');
const PaslonPartai = require('./models/PaslonPartai');
const bcrypt = require('bcrypt');
const multer = require('multer');

// Define relationships
Paslon.belongsToMany(Partai, { through: PaslonPartai, foreignKey: 'paslon_id' });
Partai.belongsToMany(Paslon, { through: PaslonPartai, foreignKey: 'partai_id' });

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Error creating database:', err);
    });

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Adjust the provider if needed

// Import the app.js functions
const votingApp = require('./connection/app.js');
const AccountEth = require('./models/AccountEth.js');
const { hasData } = require('jquery');

// Middleware
const upload = multer();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

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
    const trimmedAddress = voterAddress.trim(); // Trim whitespace
    const isValidAddress = (address) => {
        return web3.utils.isAddress(address);
    };
    console.log(voterAddress);

    if (!isValidAddress(trimmedAddress)) {
        return res.status(400).json({ success: false, message: "Invalid address" });
    }

    try {
        const hasRight = await votingApp.hasRightToVote(voterAddress);
        res.json({ success: true, hasRight }); // Return the boolean value
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to check voting rights' });
    }
});


// POST /login
app.post('/login', upload.none(), async (req, res) => {
    const { email, password } = req.body; // Access form data

    try {
        const user = await User.findOne({ where: { email } });
        const account = await AccountEth.findOne({ where: { user_id: user.user_id } });
        const address = account.address;

        // const hasVoted = votingApp.hasVoted(address);

        console.log("User:", address);

        if (user && await bcrypt.compare(password, user.password)) {
            // Generate a token (for simplicity, using a random string here)
            const token = Math.random().toString(36).substring(2);

            res.json({
                success: true,
                data: {
                    user_id: user.user_id,
                    token: token,
                    nik: user.nik,
                    sudah_vote: false
                },
                message: "Berhasil Login"
            });
        } else {
            res.json({
                success: false,
                data: null,
                message: "Data ada yang salah"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error"
        });
    }
});

// GET /paslon
app.get('/paslon', async (req, res) => {
    try {
        const paslonList = await Paslon.findAll();

        if (paslonList.length > 0) {
            res.json({
                success: true,
                data: paslonList.map(paslon => ({
                    paslon_id: paslon.calon_id,
                    nomor_urut: paslon.nomor_urut,
                    nama_paslon: paslon.nama_paslon,
                    nama_gubernur: paslon.nama_gubernur,
                    nama_wakil_gubernur: paslon.nama_wakil_gubernur,
                    gambar: paslon.gambar, // Assuming you have a gambar field
                    visi: paslon.visi
                })),
                message: "Data berhasil diambil"
            });
        } else {
            res.json({
                success: false,
                data: null,
                message: "Data gagal diambil"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Data gagal diambil"
        });
    }
});

// GET /paslon/:id
app.get('/paslon/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const partai = await Partai.findAll();
        const paslon = await Paslon.findByPk(id, {
            include: {
                model: Partai,
                through: { attributes: [] } // Exclude the junction table attributes
            }
        });

        if (paslon) {
            res.json({
                success: true,
                data: {
                    paslon_id: paslon.calon_id,
                    nama_paslon: paslon.nama_paslon,
                    nama_gubernur: paslon.nama_gubernur,
                    nama_wakil_gubernur: paslon.nama_wakil_gubernur,
                    gambar: paslon.gambar,
                    // partai: paslon.Partais.map(partai => partai.logo), // Assuming you want the logos
                    partai: partai.map(partai => partai.logo),
                    visi: paslon.visi,
                    misi: paslon.misi,
                    program_unggulan: paslon.program_unggulan,
                    biografi: paslon.biografi
                },
                message: "Data berhasil diambil"
            });
        } else {
            res.json({
                success: false,
                data: null,
                message: "Data gagal diambil"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Data gagal diambil"
        });
    }
});

//voting by user
app.post('/voting', upload.none(), async (req, res) => {
    const { paslon_id, user_id } = req.body;

    try {
        if (paslon_id || user_id) {
            const proposalIndex = paslon_id;
            const user = await AccountEth.findOne({ where: { user_id } });
            const address = user.address;
            console.log(proposalIndex);
            console.log(address);

            // res.json({ message: `Voter ${address} voted for proposal ${proposalIndex}` });
            const result = await votingApp.vote(web3, proposalIndex, address);
            res.json({
                success: true,
                data: address,
                message: "Voting Berhasil Dilakukan"
            });
        } else {
            res.json({
                success: false,
                data: null,
                message: "Voting Gagal Dilakukan"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Voting Gagal Dilakukan"
        });
    }
});

// GET /hasil-pemilihan
app.get('/hasil-pemilihan', async (req, res) => {
    try {
        // Fetch all paslon (candidates)
        const paslonList = await Paslon.findAll();

        // Fetch voting history from the blockchain
        // const votingHistory = await getVotingData();

        // Calculate total votes and votes per candidate
        // const totalVotes = votingHistory.length;
        const totalVotes = 3;
        const votesCount = {};

        // Initialize votes count for each candidate
        paslonList.forEach(paslon => {
            votesCount[paslon.nomor_urut] = 0;
        });

        // Count votes
        // votingHistory.forEach(vote => {
        //     votesCount[vote.nomor_urut] += 1; // Increment the vote count for the candidate
        // });
        votingHistory = {
            'address' : '0x123',
            'nomor_urut' : 1,
            'tanggal' : '2024-12-15',
        }

        // Prepare response data
        const responseData = {
            suara_masuk: totalVotes,
            nama_paslon: paslonList.map(paslon => ({
                paslon_id: paslon.paslon_id,
                nomor_urut: paslon.nomor_urut,
                nama_gubernur: paslon.nama_gubernur,
                nama_wakil_gubernur: paslon.nama_wakil_gubernur
            })),
            persentase_suara: paslonList.map(paslon => {
                const count = votesCount[paslon.nomor_urut] || 0;
                return totalVotes > 0 ? (count / totalVotes) * 100 : 0; // Calculate percentage
            }),
            riwayat_suara: votingHistory
        };

        // Send response 
        res.json({
            success: true,
            data: responseData,
            message: "Data berhasil diambil"
        });
    } catch (error) {
        console.error('Error fetching voting results:', error);
        res.status(500).json({
            success: false,
            data: null,
            message: "Data gagal diambil"
        });
    }
});

// GET /voting-results
app.get('/voting-results', async (req, res) => {
    try {
        // Fetch the total votes
        const totalVotes = await contract.totalVotes(); // Assuming you have a function to get total votes

        // Fetch the proposals
        const proposals = await Promise.all(
            Array.from({ length: await contract.proposals.length }, (_, i) => contract.proposals(i))
        );

        // Fetch the voting history
        const votingHistory = await Promise.all(
            Object.keys(voteHistories).map(async (address) => {
                const history = await contract.getVotingHistory(address);
                return history.map(vote => ({
                    address: vote.voterAddress,
                    jam: new Date(vote.timestamp * 1000).toLocaleTimeString(), // Convert timestamp to readable format
                    nomor_urut: vote.proposal.toString()
                }));
            })
        );

        // Calculate percentages
        const percentages = await contract.getVotePercentages();

        // Prepare response data
        const responseData = {
            suara_masuk: totalVotes.toString(),
            nama_paslon: proposals.map((proposal, index) => ({
                paslon_id: index + 1, // Assuming paslon_id is sequential
                nomor_urut: index + 1,
                nama_gubernur: ethers.utils.parseBytes32String(proposal.name), // Convert bytes32 to string
                nama_wakil_gubernur: "N/A" // Replace with actual data if available
            })),
            persentase_suara: percentages.map(p => p.toString()),
            riwayat_suara: votingHistory.flat() // Flatten the array of voting histories
        };

        res.json({
            success: true,
            data: responseData,
            message: "Data berhasil diambil"
        });
    } catch (error) {
        console.error('Error fetching voting results:', error);
        res.status(500).json({
            success: false,
            data: null,
            message: "Data gagal diambil"
        });
    }
});

app.get('/total-votes', async (req, res) => {
    try {
        const result = await votingApp.totalVotes();
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching total votes:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
