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
            const hashedPassword4 = await bcrypt.hash('password4', 10);
            const hashedPassword5 = await bcrypt.hash('password5', 10);

            await User.bulkCreate([
                { nik: '1371071812020004', name: 'Iqbal Defri Prasetya', email: 'iqbaldefriprasetya@gmail.com', password: hashedPassword1 },
                { nik: '1371071812020003', name: 'Fajar Alif Riyandi', email: 'fajaralifriyandi@gmail.com', password: hashedPassword2 },
                { nik: '1571073105030001', name: 'Daffa Rizki', email: 'daffarizki@gmail.com', password: hashedPassword3 },
                { nik: '1371071812020001', name: 'Hamzah Abdillah', email: 'hamzahabdillah@gmail.com', password: hashedPassword4 },
                { nik: '1371071812020000', name: 'M. Fazha Hanafi', email: 'fazhahanafi@gmail.com', password: hashedPassword5 }
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