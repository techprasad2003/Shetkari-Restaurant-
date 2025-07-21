const express = require("express");
const Guest = require("../models/Guest");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const guests = await Guest.find();
		res.json(guests);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

router.post("/", async (req, res) => {
	try {
		const newGuest = new Guest(req.body);
		await newGuest.save();
		res.json(newGuest);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!guest) return res.status(404).json({ message: "Guest not found" });
		res.json(guest);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const guest = await Guest.findByIdAndDelete(req.params.id);
		if (!guest) return res.status(404).json({ message: "Guest not found" });
		res.json({ message: "Guest deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;