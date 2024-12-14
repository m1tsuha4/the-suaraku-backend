const sequelize = require('../database/database.js');
const User = require('../models/User.js');

const bcrypt = require('bcrypt');

const seedUsers = async () => {
    try {
        await sequelize.sync();
        const count = await User.count();
        if (count === 0) {
            const hashedPassword1 = await bcrypt.hash('password1', 10);
            const hashedPassword2 = await bcrypt.hash('password2', 10);
            const hashedPassword3 = await bcrypt.hash('password3', 10);

            await User.bulkCreate([
                { nik: '1371071812020004', name: 'Iqbal Defri Prasetya', email: 'iqbaldefriprasetya@gmail.com', password: hashedPassword1 },
                { nik: '9876543210', name: 'user1', email: 'uGmE7@example.com', password: hashedPassword2 },
                { nik: '9876543211', name: 'user2', email: 'uGmE0@example.com', password: hashedPassword3 }
            ]);
            console.log('Users seeded successfully with hashed passwords!');
        } else {
            console.log('Users already exist. Seeding skipped.');
        }
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await sequelize.close();
    }
};

seedUsers();