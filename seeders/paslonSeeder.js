// seeders/paslonSeeder.js
const sequelize = require('../database/database.js');
const Paslon = require('../models/Paslon');
const Partai = require('../models/Partai'); 


const seedPaslon = async () => {
    try {
        await sequelize.sync();
        const count = await Paslon.count();
        if (count === 0) {
            const paslon1 = await Paslon.create({
                gambar: "https://s3-alpha-sig.figma.com/img/5e13/c8d6/f16b7e1c1d274f1304dc5ac6a615e21e?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dvODa4Zu7BLNJgMUqHp~zY1GjbQb90q0YuW8BI0DVampifKgwklJLOrCWAiBMfNJ602ohRaD-YTybAusYuKxvk2eXV7GjxpX1q-lvryZ9f4~kRE-sNNgSEKtlvUXBZJ8iAJfH66rWLdHo9ET0IwZq-PGdUaEsXLGVXlsYCxxAQ5w-SVBIYyZ0TCFu~e9h3jKvZh7AS7cDpFeBFPxqyZ8b0ayjKDpVtKL9zQCRiQwwqJMYkXFmj1W~i6wOcRUWuNFBokkXSfiKE77~yztl7s3f6565HEs3nOH48XTTMZZQf7DwBnAFtZ2czWCudYbEpdxU2eNTL7Y7pTQ-UxqM~OQPg__",
                nomor_urut: 1,
                nama_paslon: 'Calon Gubernur Urutan Ke -1',
                nama_gubernur: 'Romi Haryanto',
                nama_wakil_gubernur: 'Sudirman',
                visi: 'Jambi Maju, Adil, Berdaulat, dan Berdaya Saing',
                misi: '1. Meningkatkan Perekonomian Jambi Yang Maju, Berdaya Saing Dan Lestari.\n2. Meningkatkan Masyarakat Jambi yang cerdas,sehat,berbudaya, dan berkesejahteraan.\n3.Meningkatkan Pemerintah yang bersih,efektif, dan kondusif.',
                program_unggulan: 'Program Unggulan 1',
                biografi: 'Biografi 1'
            });

            const paslon2 = await Paslon.create({
                gambar: "https://s3-alpha-sig.figma.com/img/7eca/7b00/3e824dfbef47ad7fdcc268751141f6ad?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=i81JEREkhq5YdVPTeoFqqKVstnlVbwD9-zNJ~y~7zxEue9QqDtleXW3I8iA6RJl9H4oxp--vztgITl250ongznYkKblXNtTc1KOPQXq62ZL2MHtC5xlq3TsmX2D~tRrVOEPdAKaU-m57lGmFpSomufuZHGQZCkiNzQzcGyddMUTBxdz-ZQy06cfWlHqWPRfUP2c3JyxsAdMQVxkiq2UkUbLcPcCYYQpLdlf8OPH4oh7qR18XOi5awnDZb8IoHveIXOJhFIVQvfoM4Qx1WcFWyyrQRahWyKTPGMoSr1hRQ2DLeyQGuzVNo2ApjsU1jcpgx2rxkk5qcHUMZPFMf2RNgw__",
                nomor_urut: 2,
                nama_paslon: 'Calon Gubernur Urutan Ke -2',
                nama_gubernur: 'Al-Haris',
                nama_wakil_gubernur: 'Abdullah Sani',
                visi: 'Mewujudkan Jambi Mantap Berdaya Saing dan Berkelanjutan Berbasis Pertanian, Perdagangan dan Industri Tahun 2029 di Bawah Ridho Allah SWT',
                misi: 'Misi 2',
                program_unggulan: 'Program Unggulan 2',
                biografi: 'Biografi 2'
            });

            // Associate Paslon with Partai
            const partaiA = await Partai.findOne({ where: { nama_partai: 'Nasdem' } });
            const partaiB = await Partai.findOne({ where: { nama_partai: 'Gelora Indonesia' } });
            const partaiC = await Partai.findOne({ where: { nama_partai: 'PSI' } });
            const partaiD = await Partai.findOne({ where: { nama_partai: 'PKN' } });

            await paslon1.addPartai(partaiA);
            await paslon2.addPartai(partaiB);
            await paslon1.addPartai(partaiC);
            await paslon2.addPartai(partaiD);

            console.log('Paslon seeded successfully!');
        } else {
            console.log('Paslon already exists. Seeding skipped.');
        }
    } catch (error) {
        console.error('Error seeding Paslon:', error);
    } finally {
        await sequelize.close();
    }
};

seedPaslon();
