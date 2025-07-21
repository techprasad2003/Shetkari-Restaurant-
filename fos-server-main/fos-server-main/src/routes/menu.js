const express = require("express");
const MenuItem = require("../models/MenuItem");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const items = await MenuItem.find();
		res.json(items);
	} catch (error) {
		res.status(500).json({ message: "Error fetching menu items", error });
	}
});

router.post("/", async (req, res) => {
	try {
		const newItem = new MenuItem(req.body);
		await newItem.save();
		res.status(201).json(newItem);
	} catch (error) {
		res.status(400).json({ message: "Error creating menu item", error });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const updatedItem = await MenuItem.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		if (!updatedItem) {
			return res.status(404).json({ message: "Menu item not found" });
		}
		res.json(updatedItem);
	} catch (error) {
		res.status(400).json({ message: "Error updating menu item", error });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
		if (!deletedItem) {
			return res.status(404).json({ message: "Menu item not found" });
		}
		res.json({ message: "Menu item deleted", item: deletedItem });
	} catch (error) {
		res.status(500).json({ message: "Error deleting menu item", error });
	}
});

module.exports = router;