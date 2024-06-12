const bcrypt = require('bcrypt');

async function hashPassword(plainTextPassword) {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        console.log(`Plain Text Password: ${plainTextPassword}`);
        console.log(`Hashed Password: ${hashedPassword}`);
    } catch (err) {
        console.error('Error hashing password:', err);
    }
}

const passwordToHash = 'admin'; // Replace with the actual password
hashPassword(passwordToHash);
