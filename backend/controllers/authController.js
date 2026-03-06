const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Helper to validate email format
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        console.log("REGISTER ATTEMPT:", email);

        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'MISSING_FIELDS' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ msg: 'INVALID_EMAIL_FORMAT' });
        }

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

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'USER_NOT_FOUND' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
                to: user.email,
                subject: 'Password reset token',
                text: message,
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ msg: 'EMAIL_COULD_NOT_BE_SENT' });
        }
    } catch (err) {
        res.status(500).json({ msg: `FORGOT_PASS_ERROR: ${err.message}` });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ msg: 'INVALID_TOKEN' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, msg: 'PASSWORD_RESET_SUCCESS' });
    } catch (err) {
        res.status(500).json({ msg: `RESET_PASS_ERROR: ${err.message}` });
    }
};
