// seeders/accountEthSeeder.js
const sequelize = require ('../database/database.js');
const AccountEth = require ('../models/AccountEth.js');

const seedAccountEth = async () => {
    try {
        await sequelize.sync();
        const count = await AccountEth.count();
        if (count === 0) {
            await AccountEth.bulkCreate([
                { user_id: 1, address: '0x22FC0FB17875FEDE4e25519Be9693E585D809856', privateKey: '0xfdb006ff0d252634199743725da7e12c809973a6863a1ac6eafa38c143cc018a' },
                { user_id: 2, address: '0x3e1275eaFc5720Ea1EdA681919E2A2d4b3BB6F90', privateKey: '0xb959b9aa9f0a8ab3844f5491a626a0223d1a3b649062e7cef31cb492a6b9f162' }
            ]);
            console.log('AccountEth seeded successfully!');
        } else {
            console.log('AccountEth already exists. Seeding skipped.');
        }
    } catch (error) {
        console.error('Error seeding AccountEth:', error);
    } finally {
        await sequelize.close();
    }
};

seedAccountEth();
