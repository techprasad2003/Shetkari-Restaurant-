const express = require("express");
const Order = require("../models/Order");
const Guest = require("../models/Guest");
const Bill = require("../models/Bill");
const MenuItem = require("../models/MenuItem");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const orders = await Order.find();

		const guestIds = orders.map(order => order.guestId);
		const guests = await Guest.find({ _id: { $in: guestIds } }).select('name roomNo');

		const guestMap = guests.reduce((map, guest) => {
			map[guest._id.toString()] = { name: guest.name, roomNo: guest.roomNo };
			return map;
		}, {});

		const menuItemIds = orders.flatMap(order => order.items.map(item => item.menuItemId));
		const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } }).select('name price');

		const menuItemMap = menuItems.reduce((map, menuItem) => {
			map[menuItem._id.toString()] = { name: menuItem.name, price: menuItem.price };
			return map;
		}, {});

		const ordersWithDetails = orders.map(order => {
			const items = order.items.map(item => {
				const menuItem = menuItemMap[item.menuItemId] || { name: "Unknown", price: 0 };
				return {
					...item,
					price: item.quantity * menuItem.price,
					menuItem
				};
			});
			const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
			return {
				...order.toObject(),
				guest: guestMap[order.guestId] || { name: "Unknown", roomNo: "Unknown" },
				items,
				totalPrice
			};
		});

		res.json(ordersWithDetails);
	} catch (error) {
		res.status(500).json({ message: "Error fetching orders", error });
	}
});

router.post("/", async (req, res) => {
	const newOrder = new Order(req.body);
	await newOrder.save();

	const bill = await Bill.findOne({ guestId: req.body.guestId });
	if (bill) {
		bill.foodCharges += req.body.totalPrice;
		bill.totalAmount = bill.roomCharges + bill.foodCharges;
		await bill.save();
	} else {
		await new Bill({
			guestId: req.body.guestId,
			roomCharges: 0,
			foodCharges: req.body.totalPrice,
			totalAmount: req.body.totalPrice
		}).save();
	}

	res.json(newOrder);
});

router.put("/:id", async (req, res) => {
	const order = await Order.findByIdAndUpdate(
		req.params.id,
		{ status: req.body.status },
		{ new: true }
	);
	res.json(order);
});

router.delete("/:id", async (req, res) => {
	try {
		const order = await Order.findByIdAndDelete(req.params.id);
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		const bill = await Bill.findOne({ guestId: order.guestId });
		if (bill) {
			bill.foodCharges -= order.totalPrice;
			bill.totalAmount = bill.roomCharges + bill.foodCharges;
			await bill.save();
		}

		res.json({ message: "Order deleted", order });
	} catch (error) {
		res.status(500).json({ message: "Error deleting order", error });
	}
});

module.exports = router;