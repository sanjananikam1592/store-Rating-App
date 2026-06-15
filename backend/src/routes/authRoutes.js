const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

function validateUser(name, email, password, address) {
    if (!name || name.length < 20 || name.length > 60) {
        return "Name must be 20 to 60 characters";
    }

    if (!address || address.length > 400) {
        return "Address is required and max 400 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email";
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) {
        return "Password must be 8-16 chars, include uppercase and special character";
    }

    return null;
}

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        const error = validateUser(name, email, password, address);
        if (error) return res.status(400).json({ message: error });

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'USER')",
            [name, email, hashedPassword, address]
        );

        res.json({ message: "Signup successful" });
    } catch (error) {
        res.status(500).json({ message: "Email already exists or server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
        {
           id: user.id,
           role: user.role
        },
        process.env.JWT_SECRET
     );

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

router.put("/change-password", auth(["ADMIN", "USER", "OWNER"]), async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

        if (!passRegex.test(newPassword)) {
            return res.status(400).json({
                message: "New password must be 8-16 chars, include uppercase and special character"
            });
        }

        const [users] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [req.user.id]
        );

        const user = users[0];

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, req.user.id]
        );

        res.json({
            message: "Password updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Password update failed"
        });
    }
});
module.exports = router;