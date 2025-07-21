import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Calendar } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

interface Guest {
	_id: string;
	name: string;
	contact: string;
	roomNo: string;
	checkInDate: string;
	billStatus: "Paid" | "Unpaid";
}

const GuestManagement: React.FC = () => {
	const [guests, setGuests] = useState<Guest[]>([]);
	const [newGuest, setNewGuest] = useState({
		name: "",
		contact: "",
		roomNo: "",
		checkInDate: new Date().toISOString().split("T")[0],
		billStatus: "Unpaid" as "Paid" | "Unpaid",
	});
	const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		fetchGuests();
	}, []);

	const fetchGuests = async () => {
		const res = await axios.get("https://fos-server-hfp4.onrender.com/api/guests");
		setGuests(res.data);
	};

	const addGuest = async () => {
		try {
			const res = await axios.post(
				"https://fos-server-hfp4.onrender.com/api/guests",
				newGuest,
			);
			setGuests([...guests, res.data]);
			setNewGuest({
				name: "",
				contact: "",
				roomNo: "",
				checkInDate: new Date().toISOString().split("T")[0],
				billStatus: "Unpaid",
			});
			setIsDialogOpen(false);
			toast.success("Guest added successfully!");
		} catch (error) {
			toast.error("Failed to add guest.");
		}
	};

	const updateGuest = async () => {
		if (editingGuest) {
			try {
				const res = await axios.put(
					`https://fos-server-hfp4.onrender.com/api/guests/${editingGuest._id}`,
					newGuest,
				);
				setGuests(guests.map((g) => (g._id === editingGuest._id ? res.data : g)));
				setEditingGuest(null);
				setIsDialogOpen(false);
				toast.success("Guest updated successfully!");
			} catch (error) {
				toast.error("Failed to update guest.");
			}
		}
	};

	const deleteGuest = async (id: string) => {
		try {
			await axios.delete(`https://fos-server-hfp4.onrender.com/api/guests/${id}`);
			setGuests(guests.filter((g) => g._id !== id));
			toast.success("Guest deleted successfully!");
		} catch (error) {
			toast.error("Failed to delete guest.");
		}
	};

	const openEditDialog = (guest: Guest) => {
		setEditingGuest(guest);
		setNewGuest({
			name: guest.name,
			contact: guest.contact,
			roomNo: guest.roomNo,
			checkInDate: new Date(guest.checkInDate).toISOString().split("T")[0],
			billStatus: guest.billStatus,
		});
		setIsDialogOpen(true);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
		>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
					Guest Management
				</h1>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button className="bg-indigo-600 hover:bg-indigo-700">
							<Plus className="mr-2 h-4 w-4" /> Add Guest
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>{editingGuest ? "Edit Guest" : "Add Guest"}</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<Input
								placeholder="Name"
								value={newGuest.name}
								onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
							/>
							<Input
								placeholder="Contact"
								value={newGuest.contact}
								onChange={(e) =>
									setNewGuest({ ...newGuest, contact: e.target.value })
								}
							/>
							<Input
								placeholder="Table Number"
								value={newGuest.roomNo}
								onChange={(e) =>
									setNewGuest({ ...newGuest, roomNo: e.target.value })
								}
							/>
							<div className="relative">
								<Input
									type="date"
									value={newGuest.checkInDate}
									onChange={(e) =>
										setNewGuest({ ...newGuest, checkInDate: e.target.value })
									}
								/>
								<Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
							</div>
							<Select
								value={newGuest.billStatus}
								onValueChange={(value: "Paid" | "Unpaid") =>
									setNewGuest({ ...newGuest, billStatus: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select bill status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Paid">Paid</SelectItem>
									<SelectItem value="Unpaid">Unpaid</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button onClick={editingGuest ? updateGuest : addGuest} className="w-full">
							{editingGuest ? "Update Guest" : "Add Guest"}
						</Button>
					</DialogContent>
				</Dialog>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Contact</TableHead>
						<TableHead>Table No</TableHead>
						<TableHead>Check-In Date</TableHead>
						<TableHead>Bill Status</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{guests.map((guest) => (
						<TableRow key={guest._id}>
							<TableCell>{guest.name}</TableCell>
							<TableCell>{guest.contact}</TableCell>
							<TableCell>{guest.roomNo}</TableCell>
							<TableCell>
								{new Date(guest.checkInDate).toLocaleDateString()}
							</TableCell>
							<TableCell>
								<span
									className={cn(
										"px-2 py-1 rounded-full text-xs",
										guest.billStatus === "Paid"
											? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
											: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
									)}
								>
									{guest.billStatus}
								</span>
							</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => openEditDialog(guest)}
										className="hover:bg-indigo-100 dark:hover:bg-indigo-900"
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() => deleteGuest(guest._id)}
										className="hover:bg-red-100 dark:hover:bg-red-900"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</motion.div>
	);
};

export default GuestManagement;
