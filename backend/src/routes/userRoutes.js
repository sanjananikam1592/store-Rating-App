const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/ratings", auth(["USER"]), async (req, res) => {
    const { store_id, rating } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existingRating = await db.query(
        "SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2",
        [req.user.id, store_id]
    );
    
    if (existingRating.rows.length > 0) {
    
        await db.query(
            "UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3",
            [rating, req.user.id, store_id]
        );
    
        return res.json({
            message: "Rating updated successfully"
        });
    }
    
    await db.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES ($1,$2,$3)",
        [req.user.id, store_id, rating]
    );
    
    res.json({
        message: "Rating submitted successfully"
    });
    
    res.json({ message: "Rating submitted successfully" });
});

module.exports = router;