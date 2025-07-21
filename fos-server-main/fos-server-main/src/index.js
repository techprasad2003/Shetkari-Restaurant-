const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const menuRoutes = require("./routes/menu");
const guestRoutes = require("./routes/guest");
const orderRoutes = require("./routes/order");
const billRoutes = require("./routes/bill");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/user");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

const authMiddleware = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ message: "No token provided" });

	try {
		const decoded = jwt.verify(token, "your_jwt_secret");
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid token" });
	}
};

const roleMiddleware = (roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return res.status(403).json({ message: "Access denied" });
	}
	next();
};

mongoose.connect("mongodb+srv://manishbadgujar:ymIoIEWsRgkeODEp@cluster0.iwstq.mongodb.net/food-ordering-system").then(async () => {
	console.log("Connected to MongoDB");

	const adminExists = await User.findOne({ username: "admin" });
	if (!adminExists) {
		const hashedPassword = await bcrypt.hash("Admin@123", 10);
		const adminUser = new User({
			username: "admin",
			password: hashedPassword,
			role: "Admin",
		});
		await adminUser.save();
		console.log("Admin account created with username: admin, password: Admin@123");
	} else {
		console.log("Admin account already exists");
	}
}).catch((error) => {
	console.error("MongoDB connection error:", error);
});

app.use("/api/menu", menuRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/menu", authMiddleware, roleMiddleware(["Admin"]), menuRoutes);
// app.use("/api/guests", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), guestRoutes);
// app.use("/api/order", authMiddleware, roleMiddleware(["Admin", "Receptionist", "Kitchen"]), orderRoutes);
// app.use("/api/bill", authMiddleware, roleMiddleware(["Admin", "Receptionist"]), billRoutes);
// app.use("/api/dashboard", authMiddleware, roleMiddleware(["Admin"]), dashboardRoutes);
// app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
	res.send("Shetkari-FOS API");
});

app.listen(5000, () => {
	console.log("Server running on port 5000");
});