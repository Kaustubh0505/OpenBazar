import express from "express";
import {
  sendOtp,
  verifyOtp,
  login,
  sendLoginOtp,
  verifyLoginOtp,
} from "../controllers/authControllers.js";

const router = express.Router();

/* SIGNUP */
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

/* PASSWORD LOGIN */
router.post("/login", login);

/* OTP LOGIN */
router.post("/login/send-otp", sendLoginOtp);
router.post("/login/verify-otp", verifyLoginOtp);

export default router;
