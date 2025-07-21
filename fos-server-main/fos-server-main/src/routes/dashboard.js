const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.get("/", async (req, res) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const dailyOrders = await Order.countDocuments({
		createdAt: { $gte: today, $lt: tomorrow }
	});

	const pendingOrders = await Order.countDocuments({
		status: "Pending"
	});

	const preparingOrders = await Order.countDocuments({
		status: "Preparing"
	})

	const totalEarnings = (await Order.find()).reduce((sum, order) => sum + order.totalPrice, 0);

	res.json({ dailyOrders, pendingOrders, preparingOrders, totalEarnings });
});

module.exports = router;