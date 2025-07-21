import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Eye, Trash2 } from "lucide-react";
import axios from "axios";

interface MenuItem {
	name: string;
	price: number;
}

interface OrderItem {
	menuItemId: string;
	_doc: {
		quantity: number;
	};
	price: number;
	menuItem: MenuItem;
}

interface Guest {
	name: string;
	roomNo: string;
}

interface Order {
	_id: string;
	guest: Guest;
	items: OrderItem[];
	totalPrice: number;
	status: "Pending" | "Preparing" | "Delivered";
	createdAt: string;
}

const OrderManagement: React.FC = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const res = await axios.get("https://fos-server-hfp4.onrender.com/api/order");
			setOrders(res.data);
			toast.success("Orders fetched successfully!");
		} catch (error) {
			toast.error("Failed to fetch orders.");
		}
	};

	const updateStatus = async (orderId: string, status: "Pending" | "Preparing" | "Delivered") => {
		try {
			await axios.put(`https://fos-server-hfp4.onrender.com/api/order/${orderId}`, {
				status,
			});
			setOrders(orders.map((o) => (o._id === orderId ? { ...o, status } : o)));
			toast.success(`Order #${orderId} status updated to ${status}!`);
		} catch (error) {
			toast.error("Failed to update order status.");
		}
	};

	const deleteOrder = async (orderId: string) => {
		if (!window.confirm("Are you sure you want to delete this order?")) return;
		try {
			await axios.delete(`https://fos-server-hfp4.onrender.com/api/order/${orderId}`);
			setOrders(orders.filter((o) => o._id !== orderId));
			toast.success(`Order #${orderId} deleted successfully!`);
		} catch (error) {
			toast.error("Failed to delete order.");
		}
	};

	const openOrderDetails = (order: Order) => {
		setSelectedOrder(order);
		setIsDialogOpen(true);
	};

	const filteredOrders = orders.filter(
		(order) =>
			order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.guest.roomNo.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
		>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
					Kitchen - Order Management
				</h1>
				<div className="relative">
					<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
					<Input
						placeholder="Search orders..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Guest Name</TableHead>
						<TableHead>Table No</TableHead>
						<TableHead>Total</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredOrders.map((order) => (
						<TableRow key={order._id}>
							<TableCell>{order._id}</TableCell>
							<TableCell>{order.guest.name}</TableCell>
							<TableCell>{order.guest.roomNo}</TableCell>
							<TableCell>${order.totalPrice.toFixed(2)}</TableCell>
							<TableCell>
								<Select
									onValueChange={(value) =>
										updateStatus(
											order._id,
											value as "Pending" | "Preparing" | "Delivered",
										)
									}
									value={order.status}
								>
									<SelectTrigger className="w-[150px]">
										<SelectValue placeholder="Update Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Pending">Pending</SelectItem>
										<SelectItem value="Preparing">Preparing</SelectItem>
										<SelectItem value="Delivered">Delivered</SelectItem>
									</SelectContent>
								</Select>
							</TableCell>
							<TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => openOrderDetails(order)}
										className="hover:bg-indigo-100 dark:hover:bg-indigo-900"
									>
										<Eye className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() => deleteOrder(order._id)}
										className="hover:bg-red-100 dark:hover:bg-red-900"
									>
										<Trash2 className="h-4 w-4 text-red-500" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Order Details - #{selectedOrder?._id}</DialogTitle>
					</DialogHeader>
					{selectedOrder && (
						<div className="grid gap-4 py-4">
							<div>
								<p className="font-semibold">Guest: {selectedOrder.guest.name}</p>
								<p className="font-semibold">
									Table No: {selectedOrder.guest.roomNo}
								</p>
								<p className="font-semibold">
									Total: ${selectedOrder.totalPrice.toFixed(2)}
								</p>
								<p className="font-semibold">Status: {selectedOrder.status}</p>
								<p className="font-semibold">
									Created: {new Date(selectedOrder.createdAt).toLocaleString()}
								</p>
							</div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Quantity</TableHead>
										<TableHead>Unit Price</TableHead>
										<TableHead>Subtotal</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{selectedOrder.items.map((item, index) => (
										<TableRow key={index}>
											<TableCell>{item.menuItem.name}</TableCell>
											<TableCell>{item._doc.quantity}</TableCell>
											<TableCell>${item.menuItem.price.toFixed(2)}</TableCell>
											<TableCell>
												$
												{(item._doc.quantity * item.menuItem.price).toFixed(
													2,
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</motion.div>
	);
};

export default OrderManagement;
