const bcrypt = require('bcrypt');

const storedHash = '$2b$10$09rRG1E.yEafOjO8D61oS.lz15OA7ytVlf5I1x3W9cRSg7iIcxGO6'; // Replace with the hash from your database
const plainTextPassword = 'parent'; // Replace with the actual password

async function testComparison() {
    const result = await bcrypt.compare(plainTextPassword, storedHash);
    console.log('Comparison result:', result);
}

testComparison();
