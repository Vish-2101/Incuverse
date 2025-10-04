const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // This will automatically delete the document after 5 minutes
        expires: 300, 
    },
});

module.exports = mongoose.model('Otp', otpSchema);