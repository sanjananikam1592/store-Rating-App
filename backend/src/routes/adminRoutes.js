const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", auth(["ADMIN"]), async (req, res) => {
    const [[users]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [[stores]] = await db.query("SELECT COUNT(*) AS totalStores FROM stores");
    const [[ratings]] = await db.query("SELECT COUNT(*) AS totalRatings FROM ratings");

    res.json({
        totalUsers: users.totalUsers,
        totalStores: stores.totalStores,
        totalRatings: ratings.totalRatings
    });
});

router.post("/users", auth(["ADMIN"]), async (req, res) => {
    const { name, email, password, address, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
        "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, address, role]
    );

    res.json({ message: "User added successfully" });
});

router.get("/users", auth(["ADMIN"]), async (req, res) => {
    const { search = "", sort = "name", order = "ASC" } = req.query;

    const allowedSort = ["name", "email", "address", "role"];
    const sortBy = allowedSort.includes(sort) ? sort : "name";
    const sortOrder = order === "DESC" ? "DESC" : "ASC";

    const [rows] = await db.query(
        `SELECT id, name, email, address, role
         FROM users
         WHERE name LIKE ? OR email LIKE ? OR address LIKE ? OR role LIKE ?
         ORDER BY ${sortBy} ${sortOrder}`,
        [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.json(rows);
});

router.get("/users/:id", auth(["ADMIN"]), async (req, res) => {
    const [rows] = await db.query(
        `
        SELECT 
            users.id,
            users.name,
            users.email,
            users.address,
            users.role,
            IF(users.role = 'OWNER', AVG(ratings.rating), NULL) AS rating
        FROM users
        LEFT JOIN stores ON stores.owner_id = users.id
        LEFT JOIN ratings ON ratings.store_id = stores.id
        WHERE users.id = ?
        GROUP BY users.id
        `,
        [req.params.id]
    );

    res.json(rows[0]);
});

module.exports = router;