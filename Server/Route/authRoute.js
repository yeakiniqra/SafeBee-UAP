const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const router = express.Router();
const { auth,signup,signin,signout,AllUsers } = require('../controllers/authControllers');

// middleware to enable CORS
router.use(cors({
    origin: '*',
    credentials: true
}));

router.get('/', auth);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/users', AllUsers);


module.exports = router;