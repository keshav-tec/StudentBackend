import express from "express";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import crypto from "crypto";
import EmailVerification from "../models/EmailVerification.js";
import { sendVerificationOTP } from "../services/emailService.js";

const router = express.Router();

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOTP(otp) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

// NEW: token proving that an email was verified
function generateEmailVerificationToken(email) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return jwt.sign(
    {
      email,
      purpose: "email_verification",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m",
    }
  );
}

// REGISTER
// Public registration is limited to students and tutors.
// Admin accounts must be created through a trusted setup process.
router.post("/register", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
      college,
      department,
      year,

      // NEW
      emailVerificationToken,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (!["student", "tutor"].includes(role)) {
      return res.status(400).json({
        message:
          "Invalid role. Public registration is available for students and tutors only.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // NEW: email verification is mandatory
    if (!emailVerificationToken) {
      return res.status(400).json({
        message: "Please verify your email before creating an account.",
      });
    }

    let verificationPayload;

    try {
      verificationPayload = jwt.verify(
        emailVerificationToken,
        process.env.JWT_SECRET
      );
    } catch {
      return res.status(400).json({
        message:
          "Email verification has expired. Please verify your email again.",
      });
    }

    // NEW: make sure the verification token belongs to this email
    if (
      verificationPayload.purpose !== "email_verification" ||
      verificationPayload.email !== normalizedEmail
    ) {
      return res.status(400).json({
        message: "Email verification does not match this email address.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      college,
      department,
      year,
    });

    const userObject = user.toObject();
    delete userObject.password;

    return res.status(201).json({
      message: "Registration successful",
      user: userObject,
      token: generateToken(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    next(error);
  }
});

router.post("/send-otp", async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    await EmailVerification.findOneAndUpdate(
      { email },
      {
        email,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
      },
      {
        upsert: true,
        new: true,
      }
    );

    await sendVerificationOTP(email, otp);

    res.json({
      message: "OTP sent successfully.",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    const verification = await EmailVerification.findOne({ email });

    if (!verification) {
      return res.status(400).json({
        message: "No verification request found. Please request a new OTP.",
      });
    }

    if (verification.expiresAt < new Date()) {
      await EmailVerification.deleteOne({ _id: verification._id });

      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (verification.attempts >= 5) {
      await EmailVerification.deleteOne({ _id: verification._id });

      return res.status(429).json({
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    const submittedHash = hashOTP(otp);

    if (submittedHash !== verification.otpHash) {
      verification.attempts += 1;
      await verification.save();

      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    await EmailVerification.deleteOne({
      _id: verification._id,
    });

    // NEW: create a temporary proof of email verification
    const verificationToken = generateEmailVerificationToken(email);

    res.json({
      message: "Email verified successfully.",
      verified: true,

      // NEW
      verificationToken,
    });
  } catch (error) {
    next(error);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account is inactive",
      });
    }

    const userObject = user.toObject();
    delete userObject.password;

    return res.json({
      message: "Login successful",
      user: userObject,
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
});

// LOGOUT
// JWT authentication is stateless. The client must delete its token.
router.post("/logout", (req, res) => {
  return res.json({
    message: "Logout successful",
  });
});

// CURRENT USER
router.get("/me", protect, (req, res) => {
  return res.json({
    user: req.user,
  });
});

export default router;