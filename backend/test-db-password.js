const { Client } = require('pg');

const commonPasswords = [
    'postgres',
    'password',
    '123456',
    'admin',
    'root',
    '' // empty string
];

async function checkPassword(password) {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres', // Connect to default DB first
        password: password,
        port: 5432,
    });

    try {
        await client.connect();
        console.log(`SUCCESS! The correct password is: '${password}'`);
        await client.end();
        return true;
    } catch (err) {
        // console.log(`Failed with '${password}': ${err.message}`);
        return false;
    }
}

async function run() {
    console.log('Testing common PostgreSQL passwords...');
    for (const password of commonPasswords) {
        if (await checkPassword(password)) {
            console.log('\nPlease update your .env file with this password!');
            process.exit(0);
        }
    }
    console.log('\nAll common passwords failed. You must reset your PostgreSQL password.');
    process.exit(1);
}

run();
