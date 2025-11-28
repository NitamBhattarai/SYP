// Change password controller
export const changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    if (!results || results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    try {
      const passwordMatch = await bcrypt.compare(oldPassword, user.password_hash);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = "UPDATE users SET password_hash = ? WHERE email = ?";
      db.query(updateSql, [hashedNewPassword, email], (err) => {
        if (err) {
          return res.status(500).json({ message: "Password update error", error: err.message });
        }
        res.json({ message: "Password changed successfully" });
      });
    } catch (e) {
      res.status(500).json({ message: "Password change error", error: e.message });
    }
  });
};
import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { full_name, email, password } = req.body;

  const checkEmail = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmail, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    if (result && result.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)";
      db.query(sql, [full_name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: "Register error", error: err.message });
        res.status(201).json({ message: "User registered successfully" });
      });
    } catch (e) {
      res.status(500).json({ message: "Hashing error", error: e.message });
    }
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    if (!results || results.length === 0) {
      return res.status(400).json({ message: "Email not found" });
    }

    const user = results[0];
    try {
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT secret not set in environment" });
      }

      const token = jwt.sign(
        { id: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user.user_id, full_name: user.full_name, email: user.email }
      });
    } catch (e) {
      res.status(500).json({ message: "Login error", error: e.message });
    }
  });
};
