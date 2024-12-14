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

// Middleware
const upload = multer();
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

// POST /login
app.post('/login', upload.none(), async (req, res) => {
    const { email, password } = req.body; // Access form data

    try {
        const user = await User.findOne({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            // Generate a token (for simplicity, using a random string here)
            const token = Math.random().toString(36).substring(2);

            res.json({
                success: true,
                data: {
                    user_id: user.user_id,
                    token: token,
                    nik: user.nik // Assuming you have a NIK field in your User model
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

