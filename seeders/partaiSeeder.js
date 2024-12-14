// seeders/partaiSeeder.js
const sequelize = require('../database/database.js');
const Partai = require('../models/Partai');

const seedPartai = async () => {
    try {
        await sequelize.sync();
        const count = await Partai.count();
        if (count === 0) {
            await Partai.bulkCreate([
                { nama_partai: 'Nasdem', logo: 'https://s3-alpha-sig.figma.com/img/747e/e543/852171b45119884f05c8eb8b6f97beb3?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=E23aou1cENHoY8LIOw2JNH2xrxuP5hZ6xX17-RZFOT2wKNeVz6WVR5WViF9vQbaeerGw1ZBos09TiVUydGwd2Vgs60tDhJmhHAEEgmdzZOrlII~qNEfvZjEiRoE2U4WW1f6ZDLQjVY0CXlB7~LKZjUV0u1TDFbogroTCdvtVull5HSusLqCZgyjDM67hoOseg~JgIXs5zqadmUJIZ5Mk2VtiKpP3JWTl2Dio~EBi8glv9cUziOrpGdrfjyr~CMt22TyeJXgJ4qzvWvXbFNhHKAEYRaI1JoF64izYxw264O5wVail2gTX-n-Qq2rjEw5Q1y89Ef15S12Wp10j8uOGIw__' },
                { nama_partai: 'Gelora Indonesia', logo: 'https://s3-alpha-sig.figma.com/img/c99d/9d30/8db46a5e721483ef6a58638aea4ca83d?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TSJoel887aQTKXdBjbvKcW4xhuxSPukHpfcO5lqjrtqfQhq-CZJ8WMACl39qMSHF-uPM-mKG5Y-0RgQpOFLzrAhNWSJ3cxNdx4N9Gp5UbRrYk23x1A4-80xAY29cj6ITZi3Z3sFJxvsmbCSLMt3kWt3p6ONjo51akxkvkoQk-KeTnBfkumShnzDUoc2XSiJIiqFe0MPC1GbBx5-8ns9kvheGTkPZeh7fC2daDY5j~6B2u0PpgViHWYHkMdHgqIyj~NzzlIDcOlvQkY2IUF6IMx-EgzV-eHfMV5fVbMDaIV0Ld8zuCIja86ITc3D5q8sG~IsDnDg4WYRpPSLW7Kxp6A__' },
                { nama_partai: 'PSI', logo: 'https://s3-alpha-sig.figma.com/img/aab9/c816/74722101a5a3cace30a169fe74959d24?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NOTcC7H3nYy1fwZOp3uorg7HWAtom7bVL9cp7digYOYKKdG~FA24t25HO0KJK1WcqTEBQhvhVnDV24P8P-tFCIA8ROTnDFeGZSfQ71ctX4WlMKcmAdTajEbkuzn41frWjbtQXFPI6sVEv2ZoKdB0yQDHwLNn1QaeiJbWPFH17wYvNyC5jAia9J9ww7BL~J8-q5QupnV0cnMufo1~P3eN78Yvn9K8R~fnvVUqSs0ZtEXUk-iBxsyDA-qwU~07RORgTv9aGQHF6m2eQBElwUr1MLRVBHpp7XUUoZVKFmvj7QLW0hFD2ts2yASpiA-ZxcMcY2FuNqDn0RntEHT5EgR1Mw__' },
                { nama_partai: 'PKN', logo:'https://s3-alpha-sig.figma.com/img/ce77/6e23/71c7a5432515ede89c21a9ec1a5bf727?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JxxZAnK~5XJTybYbnv83KRB3esuTZMv9rd7VKJHoHPYAV2IFHN9gvCDzy-UVTZ4-oFD4TUjZ04v0JZ~MTes65KdCvMgO2clrLWwxozSsDS-TNhxApaZvZZBz3ijFpTpEJHaDW8fKSkSAFwpP2rBaRFGr4SCa~5GJH2O0T-BNPinSZ5-QHv0-WkHnhcwBTZ0Aw~YB42BVHoa8fCDkTQI5UTmmukwTJe2zRQ5XxTicHLpYsyM9~-~ImiehkTk2zkCvmBGf4PR1sCG4JktubMC~Yi37-mefmrByh6vZGW-zytVdKvNILJM2MYJ3WWZqIVLcVVfkceHs8osAtIY791n7Mg__'}
            ]);
            console.log('Partai seeded successfully!');
        } else {
            console.log('Partai already exists. Seeding skipped.');
        }
    } catch (error) {
        console.error('Error seeding Partai:', error);
    } finally {
        await sequelize.close();
    }
};

seedPartai();
