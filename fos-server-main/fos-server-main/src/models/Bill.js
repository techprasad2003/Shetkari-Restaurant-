const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
	guestId: { type: String, required: true },
	roomCharges: { type: Number, required: true },
	foodCharges: { type: Number, required: true },
	totalAmount: { type: Number, required: true },
	paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" }
});

module.exports = mongoose.model("Bill", BillSchema);