const { Vonage } = require('@vonage/server-sdk');
const Otp = require('../models/otp.model');
const bcrypt = require('bcrypt');

// Initialize Vonage client from environment variables
const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
});

// --- Function to Send OTP ---
async function sendOtp(req, res) {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ success: false, message: "Phone number is required." });
        }

        // Generate a 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP for security
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otpCode, salt);

        await Otp.updateOne(
            { phoneNumber: phoneNumber },
            { otp: hashedOtp },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

 
        const from = process.env.VONAGE_BRAND_NAME || "MyApp";
        const to = phoneNumber; // Make sure it's in E.164 format, e.g., 919876543210
        const text = `Your verification code is: ${otpCode}`;

        await vonage.sms.send({ to, from, text });

        console.log(`OTP sent to ${phoneNumber}: ${otpCode}`);
        res.status(200).json({ success: true, message: `OTP sent successfully to ${phoneNumber}.` });

    } catch (error) {
        console.error("Error sending OTP:", error);
        if (error.response && error.response.messages && error.response.messages.length > 0) {
            const firstMessage = error.response.messages[0];
            console.error("Vonage API Error Status:", firstMessage.status);
            console.error("Vonage API Error Text:", firstMessage['error-text']);
        }
        res.status(500).json({ success: false, message: "Failed to send OTP.", error: error.message });
    }
}


// --- Function to Verify OTP ---
async function verifyOtp(req, res) {
    try {
        const { phoneNumber, otp } = req.body;
        if (!phoneNumber || !otp) {
            return res.status(400).json({ success: false, message: "Phone number and OTP are required." });
        }

        // 1. Find the OTP entry for the given phone number
        const otpRecord = await Otp.findOne({ phoneNumber });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid OTP or phone number. Please try again." });
        }

        // 2. Compare the provided OTP with the hashed one in the database
        const isMatch = await bcrypt.compare(otp, otpRecord.otp);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid OTP. Please check and try again." });
        }

        // 3. If verification is successful, delete the OTP record
        await Otp.deleteOne({ phoneNumber });

        res.status(200).json({ success: true, message: "OTP verified successfully." });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ success: false, message: "Failed to verify OTP.", error: error.message });
    }
}

module.exports = {
    sendOtp,
    verifyOtp
};


