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

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ success: false, message: 'All fields are required.' });
        }

        // Find user (works for both User and Employee)
        let user = await User.findById(userId);
        if (!user) {
            // Try Employee model if not found in User
            const Employee = (await import('../models/Employee.js')).default;
            user = await Employee.findById(userId);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: 'User not found.' });
            }
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect.'
            });
        }

        // Hash new password and update
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};
