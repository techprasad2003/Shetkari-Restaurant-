import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface Guest {
	_id: string;
	name: string;
	roomNo: string;
}

interface MenuItem {
	_id: string;
	name: string;
	price: number;
}

interface OrderItem {
	menuItemId: string;
	name: string;
	quantity: number;
	price: number;
}

const OrderPlacement: React.FC = () => {
	const [guests, setGuests] = useState<Guest[]>([]);
	const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
	const [selectedGuest, setSelectedGuest] = useState<string>("");
	const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
	const [selectedMenuItem, setSelectedMenuItem] = useState<string>("");
	const [quantity, setQuantity] = useState<number>(1);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [guestsRes, menuRes] = await Promise.all([
					axios.get("https://fos-server-hfp4.onrender.com/api/guests", {
						headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
					}),
					axios.get("https://fos-server-hfp4.onrender.com/api/menu", {
						headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
					}),
				]);
				setGuests(guestsRes.data);
				setMenuItems(menuRes.data);
				toast.success("Guests and menu items loaded successfully!");
			} catch (err) {
				setError("Failed to load guests or menu items");
				toast.error("Failed to load guests or menu items");
				console.error(err);
			}
		};
		fetchData();
	}, []);

	const addItemToOrder = () => {
		if (!selectedMenuItem) {
			setError("Please select a menu item");
			return;
		}
		if (quantity < 1) {
			setError("Quantity must be at least 1");
			return;
		}
		const item = menuItems.find((i) => i._id === selectedMenuItem);
		if (item) {
			setOrderItems([
				...orderItems,
				{ menuItemId: item._id, name: item.name, quantity, price: item.price * quantity },
			]);
			setSelectedMenuItem("");
			setQuantity(1);
			setError("");
			toast.success("Item added to order!");
		}
	};

	const removeItemFromOrder = (index: number) => {
		setOrderItems(orderItems.filter((_, i) => i !== index));
		toast.success("Item removed from order!");
	};

	const placeOrder = async () => {
		if (!selectedGuest) {
			setError("Please select a guest");
			return;
		}
		if (orderItems.length === 0) {
			setError("Please add at least one item to the order");
			return;
		}
		try {
			const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);
			await axios.post(
				"https://fos-server-hfp4.onrender.com/api/order",
				{
					guestId: selectedGuest,
					items: orderItems,
					totalPrice,
					status: "Pending",
				},
				{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
			);
			setOrderItems([]);
			setSelectedGuest("");
			setError("");
			toast.success("Order placed successfully!");
		} catch (err: any) {
			setError(err.response?.data?.message || "Failed to place order");
			toast.error(err.response?.data?.message || "Failed to place order");
			console.error(err);
		}
	};

	const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6"
		>
			<div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
				<h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 mb-6 text-center">
					Place New Order
				</h1>

				{error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded mb-6"
					>
						{error}
					</motion.div>
				)}

				{/* Guest Selection */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Select Guest
					</label>
					<Select onValueChange={setSelectedGuest} value={selectedGuest}>
						<SelectTrigger className="w-full border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200">
							<SelectValue placeholder="Select Guest" />
						</SelectTrigger>
						<SelectContent className="bg-white dark:bg-gray-700 dark:text-gray-200">
							{guests.map((guest) => (
								<SelectItem key={guest._id} value={guest._id}>
									{guest.name} - Table {guest.roomNo}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Add Item Form */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
						Add Menu Item
					</h2>
					<div className="flex flex-col sm:flex-row gap-4">
						<Select onValueChange={setSelectedMenuItem} value={selectedMenuItem}>
							<SelectTrigger className="w-full sm:w-1/2 border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200">
								<SelectValue placeholder="Select Menu Item" />
							</SelectTrigger>
							<SelectContent className="bg-white dark:bg-gray-700 dark:text-gray-200">
								{menuItems.map((item) => (
									<SelectItem key={item._id} value={item._id}>
										{item.name} - ${item.price}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Input
							type="number"
							placeholder="Quantity"
							value={quantity}
							onChange={(e) => setQuantity(Number(e.target.value))}
							min={1}
							className="w-full sm:w-1/4 border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-gray-200"
						/>
						<Button
							onClick={addItemToOrder}
							className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white flex items-center gap-2"
						>
							<PlusCircle className="w-5 h-5" /> Add Item
						</Button>
					</div>
				</div>

				{/* Order Summary */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
						Order Summary
					</h2>
					{orderItems.length === 0 ? (
						<p className="text-gray-500 dark:text-gray-400">
							No items added to the order yet.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="bg-gray-100 dark:bg-gray-700">
										<th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
											Item
										</th>
										<th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
											Quantity
										</th>
										<th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
											Price
										</th>
										<th className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{orderItems.map((item, index) => (
										<motion.tr
											key={index}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className="border-b border-gray-200 dark:border-gray-600"
										>
											<td className="p-3 text-gray-700 dark:text-gray-200">
												{item.name}
											</td>
											<td className="p-3 text-gray-700 dark:text-gray-200">
												{item.quantity}
											</td>
											<td className="p-3 text-gray-700 dark:text-gray-200">
												${item.price.toFixed(2)}
											</td>
											<td className="p-3">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => removeItemFromOrder(index)}
													className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
												>
													<Trash2 className="w-5 h-5" />
												</Button>
											</td>
										</motion.tr>
									))}
								</tbody>
							</table>
							<div className="mt-4 text-right">
								<p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
									Total: ${totalPrice.toFixed(2)}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Place Order Button */}
				<div className="text-center">
					<Button
						onClick={placeOrder}
						disabled={!selectedGuest || orderItems.length === 0}
						className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-3 text-lg"
					>
						Place Order
					</Button>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderPlacement;
