import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// helper that runs a query and returns rows
const query = (...args) =>
  db
    .promise()
    .query(...args)
    .then(([rows]) => rows);

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: parseInt(process.env.EMAIL_PORT),
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   }
// });

// simple validators
const isEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
const isStrongPassword = (p) => typeof p === "string" && p.length >= 6;

// normalize email for consistency
const normalizeEmail = (e) => (e || "").trim().toLowerCase();

// User Registration
export const register = async (req, res) => {
  try {
    let { full_name, email, password } = req.body;
    email = normalizeEmail(email);

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existing = await query("SELECT user_id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db
      .promise()
      .query(
        "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
        [full_name, email, hashedPassword],
      );

    res.status(201).json({
      message: "User registered successfully",
      userId: result[0].insertId,
    });
  } catch (error) {
    console.error("Registration error", error);
    res.status(500).json({ message: "Registration error" });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = normalizeEmail(email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find user
    const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Login error" });
  }
};

// Pandit Registration
export const panditRegister = async (req, res) => {
  try {
    let {
      full_name,
      email,
      password,
      experience_years,
      specialization,
      location,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }
    email = normalizeEmail(email);
    if (!isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if pandit exists
    const existing = await query(
      "SELECT pandit_id FROM pandits WHERE email = ?",
      [email],
    );
    if (existing.length) {
      return res
        .status(400)
        .json({ message: "Email already registered as pandit" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db
      .promise()
      .query(
        "INSERT INTO pandits (full_name, email, password_hash, experience_years, specialization, location) VALUES (?, ?, ?, ?, ?, ?)",
        [
          full_name,
          email,
          hashedPassword,
          experience_years || null,
          specialization || null,
          location || null,
        ],
      );

    res.status(201).json({
      message: "Pandit registered successfully",
      panditId: result[0].insertId,
    });
  } catch (error) {
    console.error("Pandit registration error", error);
    res.status(500).json({ message: "Pandit registration error" });
  }
};

// Pandit Login
export const panditLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = normalizeEmail(email); // FIX: normalize email like user login does

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const rows = await query("SELECT * FROM pandits WHERE email = ?", [email]);
    const pandit = rows[0];
    if (!pandit) {
      return res.status(400).json({ message: "Pandit email not found" });
    }

    const passwordMatch = await bcrypt.compare(password, pandit.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { id: pandit.pandit_id, email: pandit.email, role: "pandit" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Pandit login successful",
      token,
      pandit: {
        id: pandit.pandit_id,
        full_name: pandit.full_name,
        email: pandit.email,
        experience_years: pandit.experience_years,
        specialization: pandit.specialization,
        location: pandit.location,
      },
    });
  } catch (error) {
    console.error("Pandit login error", error);
    res.status(500).json({ message: "Pandit login error" });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new passwords are required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // choose table based on role (whitelist)
    const mapping = {
      user: { table: "users", pk: "user_id" },
      pandit: { table: "pandits", pk: "pandit_id" },
    };
    const info = mapping[req.user.role];
    if (!info) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const rows = await query(
      `SELECT * FROM ${info.table} WHERE ${info.pk} = ?`,
      [req.user.id],
    );
    const record = rows[0];
    if (!record) {
      return res.status(400).json({ message: "Account not found" });
    }

    const passwordMatch = await bcrypt.compare(
      oldPassword,
      record.password_hash,
    );
    if (!passwordMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db
      .promise()
      .query(
        `UPDATE ${info.table} SET password_hash = ? WHERE ${info.pk} = ?`,
        [hashedNewPassword, req.user.id],
      );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Password change error",
      error: error.message,
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    email = normalizeEmail(email);

    const [rows] = await db.promise().query(
      'SELECT * FROM admins WHERE email = ?', [email]
    );
    if (!rows.length)
      return res.status(401).json({ message: 'Invalid credentials' });

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.admin_id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      userType: 'admin',
      user: { id: admin.admin_id, full_name: admin.full_name, email: admin.email }
    });
  } catch (err) {
    console.error('adminLogin error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
