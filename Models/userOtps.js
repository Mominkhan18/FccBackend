const mongoose = require('mongoose');

const userOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    otpExpiresAt: {
        type: Date,
        required: true
    }
}, { collection: 'userotps' });

const UserOtp = mongoose.model('UserOtp', userOtpSchema);

module.exports = UserOtp;