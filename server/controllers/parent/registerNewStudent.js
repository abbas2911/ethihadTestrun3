const multer = require('multer');
const jwt = require('jsonwebtoken');
const db = require('../../database/db');

const secretKey = process.env.JWT_SECRET;

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('emiratesIDImage');

const register = async (req, res) => {
    // Handle file upload
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size limit exceeded' });
            }
            return res.status(400).json({ message: 'File upload error' });
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Unknown error:', err);
            return res.status(500).json({ message: 'Unknown error occurred' });
        }

        // Check if file is missing
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const emiratesIDImage = req.file.buffer; // Buffer of the uploaded image

        const { firstName, lastName, email, phone, birthday, gender, nationality, current_school, emiratesID, transport_pickup, transport_drop, address, ageCategoryID, medical_conditions, type, active } = req.body;

        const studentType = type || 'General';
        const studentActive = active || '0';

        try {
            // Check if Authorization header exists
            if (!req.headers.authorization) {
                return res.status(401).json({ message: 'Authorization header missing' });
            }

            // Extract token from the Authorization header
            const token = req.headers.authorization.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'Token missing' });
            }

            // Decode the token to get the username
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, secretKey);
            } catch (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const username = decodedToken.username;

            // Retrieve the parentID from the database using the username
            const parentQuery = `
                SELECT p.parentID
                FROM parent p
                JOIN users u ON p.userID = u.userID
                WHERE u.username = ?
            `;
            const parentResult = await db.query(parentQuery, [username]);
            
            if (!parentResult || parentResult.length === 0) {
                return res.status(404).json({ message: 'Parent not found' });
            }

            const parentID = parentResult[0].parentID;

            // Insert the new student with the retrieved parentID
            const insertUserQuery = 'INSERT INTO student (parentID, firstName, lastName, email, phone, birthday, gender, nationality, current_school, emiratesID, emiratesIDImage, transport_pickup, transport_drop, address, ageCategoryID, medical_conditions, type, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            await db.query(insertUserQuery, [parentID, firstName, lastName, email, phone, birthday, gender, nationality, current_school, emiratesID, emiratesIDImage, transport_pickup, transport_drop, address, ageCategoryID, medical_conditions, studentType, studentActive]);

            res.status(201).json({ message: 'Student registered successfully' });

        } catch (error) {
            console.error('Error registering student:', error);
            res.status(500).json({ message: 'Registration failed', error: 'An unexpected error occurred' });
            // Log detailed error internally
        }
    });
};

module.exports = { register };