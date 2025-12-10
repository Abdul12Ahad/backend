const express = require('express');
const router = express.Router();
const Card = require('../models/Cards');
const authMiddleware = require('../middleware/authMiddleware');

router.post("/", authMiddleware, async (req, res) => {
    try {
        const card = new Card({
            ...req.body,
            userId: req.userId 
        });
        await card.save();
        res.status(201).json(card);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const cards = await Card.find({ userId: req.userId });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updated = await Card.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Card not found or not authorized" });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deleted = await Card.findOneAndDelete({ _id: req.params.id, userId: req.userId }); 
        if (!deleted) {
            return res.status(404).json({ message: "Card not found or not authorized" });
        }
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
