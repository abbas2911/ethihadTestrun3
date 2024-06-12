require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { login } = require('./controllers/loginController');
const { signup } = require('./controllers/signupController');
const { register } = require('./controllers/parent/registerNewStudent');
const verifyToken = require('./middleware/auth');
const { fetchStudentData } = require('./controllers/admin/pullStudentInfo');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/login', login);
app.post('/api/signup', signup);
app.post('/api/register', register); 
app.get('/api/students', fetchStudentData);

// Example of a protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ msg: 'This is a protected route', user: req.userId, role: req.userRole });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
