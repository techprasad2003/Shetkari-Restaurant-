const express = require("express");
const Bill = require("../models/Bill");

const router = express.Router();

router.get("/:guestId", async (req, res) => {
	const bill = await Bill.findOne({ guestId: req.params.guestId });
	res.json(bill || {});
});

router.put("/:id", async (req, res) => {
	const bill = await Bill.findByIdAndUpdate(
		req.params.id,
		{ paymentStatus: req.body.paymentStatus },
		{ new: true },
	);
	res.json(bill);
});

module.exports = router;
