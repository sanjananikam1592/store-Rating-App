const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth(["ADMIN"]), async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    await db.query(
        "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
        [name, email, address, owner_id]
    );

    res.json({ message: "Store added successfully" });
});

router.get("/", auth(["ADMIN", "USER"]), async (req, res) => {
    const { search = "", sort = "name", order = "ASC" } = req.query;

    const allowedSort = ["name", "email", "address"];
    const sortBy = allowedSort.includes(sort) ? sort : "name";
    const sortOrder = order === "DESC" ? "DESC" : "ASC";

    const userId = req.user.id;

    const [rows] = await db.query(
        `
        SELECT 
            stores.id,
            stores.name,
            stores.email,
            stores.address,
            ROUND(AVG(ratings.rating), 1) AS overallRating,
            myrating.rating AS userRating
        FROM stores
        LEFT JOIN ratings ON ratings.store_id = stores.id
        LEFT JOIN ratings AS myrating 
            ON myrating.store_id = stores.id AND myrating.user_id = ?
        WHERE stores.name LIKE ? OR stores.address LIKE ? OR stores.email LIKE ?
        GROUP BY stores.id, myrating.rating
        ORDER BY ${sortBy} ${sortOrder}
        `,
        [userId, `%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.json(rows);
});

module.exports = router;