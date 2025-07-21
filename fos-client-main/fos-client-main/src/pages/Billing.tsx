import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Check,
	Download,
	Loader2,
	User,
	CreditCard,
	Coffee,
	Receipt,
	AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Guest {
	_id: string;
	name: string;
	roomNo: string;
}

interface Bill {
	_id: string;
	guestId: string;
	roomCharges: number;
	foodCharges: number;
	totalAmount: number;
	paymentStatus: "Paid" | "Unpaid";
}

const Billing = () => {
	const [guests, setGuests] = useState<Guest[]>([]);
	const [selectedGuest, setSelectedGuest] = useState<string>("");
	const [bill, setBill] = useState<Bill | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	useEffect(() => {
		const fetchGuests = async () => {
			setIsLoading(true);
			try {
				const res = await axios.get("https://fos-server-hfp4.onrender.com/api/guests", {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				});
				setGuests(res.data);
				toast.success("Guests loaded successfully!");
			} catch (error) {
				console.error("Failed to fetch guests:", error);
				toast.error("Failed to fetch guests");
			} finally {
				setIsLoading(false);
			}
		};

		fetchGuests();
	}, []);

	const fetchBill = async () => {
		if (selectedGuest) {
			setIsLoading(true);
			try {
				const res = await axios.get(
					`https://fos-server-hfp4.onrender.com/api/bill/${selectedGuest}`,
					{
						headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
					},
				);
				setBill(res.data);
				toast.success("Bill fetched successfully!");
			} catch (error: any) {
				console.error("Failed to fetch bill:", error);
				toast.error(error.response?.data?.message || "Failed to fetch bill");
				setBill(null);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const updatePaymentStatus = async (status: "Paid" | "Unpaid") => {
		if (bill) {
			setIsLoading(true);
			try {
				await axios.put(
					`https://fos-server-hfp4.onrender.com/api/bill/${bill._id}`,
					{ paymentStatus: status },
					{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
				);
				setBill({ ...bill, paymentStatus: status });
				setShowSuccess(true);
				setTimeout(() => setShowSuccess(false), 2000);
				toast.success(`Payment status updated to ${status}!`);
			} catch (error: any) {
				console.error("Failed to update payment status:", error);
				toast.error(error.response?.data?.message || "Failed to update payment status");
			} finally {
				setIsLoading(false);
			}
		}
	};

	const downloadInvoice = () => {
		if (bill) {
			const guestName = guests.find((g) => g._id === bill.guestId)?.name || "Unknown Guest";
			const invoice = `
        Invoice for Guest: ${guestName}
        Table Charges: $${bill.roomCharges.toFixed(2)}
        Food Charges: $${bill.foodCharges.toFixed(2)}
        Total: $${bill.totalAmount.toFixed(2)}
        Status: ${bill.paymentStatus}
      `;
			const blob = new Blob([invoice], { type: "text/plain" });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `invoice_${guestName.replace(/\s+/g, "_")}_${bill._id}.txt`;
			link.click();
			toast.success("Invoice downloaded successfully!");
		}
	};

	const getGuestName = (guestId: string) => {
		return guests.find((g) => g._id === guestId)?.name || "Unknown Guest";
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="max-w-3xl mx-auto py-8 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900"
		>
			<motion.div
				initial={{ y: -20 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="flex items-center mb-8"
			>
				<CreditCard className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mr-3" />
				<h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
					Billing Management
				</h1>
			</motion.div>

			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
				<h2 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">
					Select Guest
				</h2>
				<div className="flex flex-col md:flex-row md:items-center gap-4">
					<div className="flex-grow">
						<Select
							onValueChange={setSelectedGuest}
							value={selectedGuest}
							disabled={isLoading}
						>
							<SelectTrigger className="w-full h-11 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
								<SelectValue placeholder="Select a guest" />
							</SelectTrigger>
							<SelectContent className="bg-white dark:bg-gray-700 dark:text-gray-200">
								{guests.map((guest) => (
									<SelectItem key={guest._id} value={guest._id}>
										<div className="flex items-center">
											<User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
											<span>
												{guest.name} - Table {guest.roomNo}
											</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button
						onClick={fetchBill}
						disabled={!selectedGuest || isLoading}
						className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Receipt className="h-4 w-4 mr-2" />
						)}
						Fetch Bill
					</Button>
				</div>
			</div>

			<AnimatePresence>
				{bill && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.4 }}
						className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
					>
						<div className="p-6 border-b border-gray-100 dark:border-gray-700">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
									Bill Details
								</h2>
								<div
									className={`px-3 py-1 rounded-full text-sm font-medium ${
										bill.paymentStatus === "Paid"
											? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
											: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300"
									}`}
								>
									{bill.paymentStatus}
								</div>
							</div>

							<div className="mb-6">
								<div className="flex items-center mb-2">
									<User className="h-5 w-5 text-gray-400 dark:text-gray-300 mr-2" />
									<span className="text-gray-700 dark:text-gray-200 font-medium">
										{getGuestName(bill.guestId)}
									</span>
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
									<span className="text-gray-600 dark:text-gray-300">
										Table Charges
									</span>
									<span className="font-medium text-gray-700 dark:text-gray-200">
										${bill.roomCharges.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
									<div className="flex items-center">
										<Coffee className="h-4 w-4 text-gray-400 dark:text-gray-300 mr-2" />
										<span className="text-gray-600 dark:text-gray-300">
											Food & Beverages
										</span>
									</div>
									<span className="font-medium text-gray-700 dark:text-gray-200">
										${bill.foodCharges.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between items-center py-3">
									<span className="font-semibold text-gray-800 dark:text-gray-200">
										Total Amount
									</span>
									<span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
										${bill.totalAmount.toFixed(2)}
									</span>
								</div>
							</div>
						</div>

						<div className="p-6 bg-gray-50 dark:bg-gray-700">
							<div className="flex flex-wrap gap-3">
								<Button
									onClick={() => updatePaymentStatus("Paid")}
									disabled={bill.paymentStatus === "Paid" || isLoading}
									className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
								>
									<Check className="h-4 w-4 mr-2" />
									Mark as Paid
								</Button>
								<Button
									onClick={() => updatePaymentStatus("Unpaid")}
									disabled={bill.paymentStatus === "Unpaid" || isLoading}
									className="flex-1 bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-500 text-white"
								>
									<AlertCircle className="h-4 w-4 mr-2" />
									Mark as Unpaid
								</Button>
								<Button
									onClick={downloadInvoice}
									disabled={isLoading}
									className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
								>
									<Download className="h-4 w-4 mr-2" />
									Download Invoice
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showSuccess && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center"
					>
						<Check className="h-5 w-5 mr-2" />
						Status updated successfully!
					</motion.div>
				)}
			</AnimatePresence>

			{isLoading && !bill && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex justify-center items-center py-16"
				>
					<Loader2 className="h-8 w-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
				</motion.div>
			)}

			{!isLoading && !bill && selectedGuest && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-16 text-gray-500 dark:text-gray-400"
				>
					No bill information found for this guest.
				</motion.div>
			)}
		</motion.div>
	);
};

export default Billing;
