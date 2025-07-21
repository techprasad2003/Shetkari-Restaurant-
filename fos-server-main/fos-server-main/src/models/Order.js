const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
	guestId: { type: String, required: true },
	items: [
		{
			menuItemId: { type: String, required: true },
			quantity: { type: Number, required: true },
			price: { type: Number, required: true }
		}
	],
	totalPrice: { type: Number, required: true },
	status: { type: String, enum: ["Pending", "Preparing", "Delivered"], default: "Pending" },
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);