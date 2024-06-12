const db = require('../../database/db');

function fetchStudentData(req, res) {
    const query = 'SELECT studentID, firstName, emiratesIDImage FROM student';

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ msg: 'Internal server error' });
        }

        // Ensure each image is properly converted to base64
        const studentsWithImages = result.map(student => ({
            studentID: student.studentID,
            firstName: student.firstName,
            // Assuming emiratesIDImage is stored as a buffer
            emiratesIDImage: student.emiratesIDImage.toString('base64')
        }));


        return res.json(studentsWithImages);
    });
}

module.exports = { fetchStudentData };