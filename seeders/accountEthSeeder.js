// seeders/accountEthSeeder.js
const sequelize = require ('../database/database.js');
const AccountEth = require ('../models/AccountEth.js');

const seedAccountEth = async () => {
    try {
        await sequelize.sync();
        const count = await AccountEth.count();
        if (count === 0) {
            await AccountEth.bulkCreate([
                { user_id: 1, address: '0xe79d5b13b800bc5aBecDbA822a301Fa1e53cbAc5', privateKey: '0x3c49bc62d464e8daecf679e58faf0fcd5fa4037a25b1aa06daf715b28b9a85e3' },
                { user_id: 2, address: '0x8C2ce5FED33F2A368616dc1675cf509c82d65c46', privateKey: '0xcdb8ce8bb0bbf851259de29a60818cb800cd870af5d99321bd6dfae6e7f8468c' },
                { user_id: 3, address: '0xB4C1ce927fB0a66B5f2d10bbd513De23FF63293F', privateKey: '0xd9bd11f9f9714c75a1c84f364bfb0eed298538f2353217a881cf762b72bc9200' },
                { user_id: 4, address: '0x6dD55300AF110f386baa116E2497006bA2FE1205', privateKey: '0x3c49bc62d464e8daecf679e58faf0fcd5fa4037a25b1aa06daf715b28b9a85e3' },
                { user_id: 5, address: '0xD5E773df7A053037a16b030296D37C4e6937A986', privateKey: '0xef26bf2ea09770c85f83171b03ca836574607b711f352d31587ef3b042fb2d0a' }
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
