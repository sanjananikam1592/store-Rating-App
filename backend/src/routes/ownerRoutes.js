const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", auth(["OWNER"]), async (req, res) => {
    const [[store]] = await db.query(
        "SELECT * FROM stores WHERE owner_id = ?",
        [req.user.id]
    );

    if (!store) {
        return res.json({
            averageRating: 0,
            ratings: []
        });
    }

    const [[avg]] = await db.query(
        "SELECT ROUND(AVG(rating), 1) AS averageRating FROM ratings WHERE store_id = ?",
        [store.id]
    );

    const [ratings] = await db.query(
        `
        SELECT users.name, users.email, users.address, ratings.rating
        FROM ratings
        JOIN users ON users.id = ratings.user_id
        WHERE ratings.store_id = ?
        `,
        [store.id]
    );

    res.json({
        store,
        averageRating: avg.averageRating || 0,
        ratings
    });
});

module.exports = router;