import User from './../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User Not Found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(404)
                .json({ success: false, error: 'Wrong Password' });
        }

        const token = jwt.sign(
            { _id: user?._id, role: user?.role },
            process.env.JWT_KEY,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '30d'
            }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('authController.js : Error during login:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Verify user
// @route   POST /api/auth/verify
// @access  Private
export const verify = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id);
        console.log('verify user == ', user);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User Not Found' });
        }

        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error('authController.js : Error during verification:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
