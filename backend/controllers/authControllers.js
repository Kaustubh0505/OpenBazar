import User from "../models/User.js";
import { generateOtp } from "../utils/GenerateOtp.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { sendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library"; // Import Google Auth Library
dotenv.config()
import bcrypt from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google ID token (credential) missing",
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        })


        const payload = ticket.getPayload();
        const { email, name, picture } = payload;


        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPass = await bcrypt.hash(randomPassword, 10);

            user = new User({
                name,
                email,
                password: hashedPass,
                role: "buyer", 
                isEmailVerified: true, 
            });

            await user.save();
        }

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: picture,
            },
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: "Google login failed" });
    }
};



//signup otp
export const sendOtp = async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    try {
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Name, email, phone and password are required",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists. Please login.",
            });
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const otp = generateOtp();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

        if (!user) {
            user = new User({
                name,
                email,
                phone,
                password: hashedPass,
                otp,
                otpExpiry,
                role: role || "buyer",
            });
        } else {
            user.name = name;
            user.email = email;
            user.password = password;
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            if (role) user.role = role;
        }
        await user.save();



        await sendEmail({
            to: email,
            subject: "Your OTP for OpenBazaar Email Verification",
            text: `
          Hello,
          
          Thank you for signing up with OpenBazaar.
          
          Your One-Time Password (OTP) for email verification is:
          
          ${otp}
          
          This OTP is valid for 5 minutes. Please do not share it with anyone.
          
          If you did not request this verification, please ignore this email.
          
          Best regards,
          OpenBazaar Team
            `,
          });
          



        return res.status(200).json({
            success: true,
            message: "OTP sent for signup",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


//verify otp
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.otp || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



//login
export const login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        if (!identifier || !password) {
            return res.status(400).json({
                message: "Identifier and password are required",
            });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
        }

        // if (!user.isEmailVerified) {
        //   return res.status(403).json({
        //     message: "Phone number not verified",
        //   });
        // }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



//send login otp
export const sendLoginOtp = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found. Please signup.",
            });
        }


        const otp = generateOtp();
        const otpExpiry = Date.now() + 5 * 60 * 1000;

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();


        await sendEmail({
            to: `${email}`,
            subject: "OTP verification for OpenBazaar",
            text: `Message from OpenBazaar.Your OTP for email verification is ${otp} is valid for 5 minutes`,
        });


        return res.status(200).json({
            success: true,
            message: "OTP sent for login",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



//verify login otp
export const verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.otp || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
