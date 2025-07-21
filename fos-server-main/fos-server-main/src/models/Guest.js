const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
	name: { type: String, required: true },
	contact: { type: String, required: true },
	roomNo: { type: String, required: true },
	checkInDate: { type: Date, required: true },
	billStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" }
});

module.exports = mongoose.model("Guest", GuestSchema);