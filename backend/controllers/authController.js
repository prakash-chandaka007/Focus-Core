const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Immediate log
        console.log("REGISTER ATTEMPT:", email);

        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'MISSING_FIELDS' });
        }

        // DB Check
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: 'EMAIL_EXISTS' });

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = jwt.sign(
            { user: { id: newUser.id } },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });

    } catch (err) {
        console.error("DEBUG REGISTER ERROR:", err);
        res.status(500).json({ msg: `FATAL_DB_ERROR: ${err.message}` });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'INVALID_USER' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'INVALID_PASS' });

        const token = jwt.sign(
            { user: { id: user.id } },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: `FATAL_LOGIN_ERROR: ${err.message}` });
    }
};
