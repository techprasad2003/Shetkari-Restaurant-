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
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import axios from "axios";

interface MenuItem {
	_id: string;
	name: string;
	description: string;
	category: string;
	price: number;
}

const MenuManagement: React.FC = () => {
	const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
	const [newItem, setNewItem] = useState({
		name: "",
		description: "",
		category: "",
		price: 0,
	});
	const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		fetchMenuItems();
	}, []);

	const fetchMenuItems = async () => {
		const res = await axios.get("https://fos-server-hfp4.onrender.com/api/menu");
		setMenuItems(res.data);
	};

	const addItem = async () => {
		try {
			const res = await axios.post("https://fos-server-hfp4.onrender.com/api/menu", newItem);
			setMenuItems([...menuItems, res.data]);
			setNewItem({ name: "", description: "", category: "", price: 0 });
			setIsDialogOpen(false);
			toast.success("Menu item added successfully!");
		} catch (error) {
			toast.error("Failed to add menu item.");
		}
	};

	const updateItem = async () => {
		if (editingItem) {
			try {
				const res = await axios.put(
					`https://fos-server-hfp4.onrender.com/api/menu/${editingItem._id}`,
					newItem,
				);
				setMenuItems(menuItems.map((i) => (i._id === editingItem._id ? res.data : i)));
				setEditingItem(null);
				setIsDialogOpen(false);
				toast.success("Menu item updated successfully!");
			} catch (error) {
				toast.error("Failed to update menu item.");
			}
		}
	};

	const deleteItem = async (id: string) => {
		try {
			await axios.delete(`https://fos-server-hfp4.onrender.com/api/menu/${id}`);
			setMenuItems(menuItems.filter((i) => i._id !== id));
			toast.success("Menu item deleted successfully!");
		} catch (error) {
			toast.error("Failed to delete menu item.");
		}
	};

	const openEditDialog = (item: MenuItem) => {
		setEditingItem(item);
		setNewItem({
			name: item.name,
			description: item.description,
			category: item.category,
			price: item.price,
		});
		setIsDialogOpen(true);
	};

	const filteredItems = menuItems.filter(
		(item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.category.toLowerCase().includes(searchTerm.toLowerCase()),
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
					Menu Management
				</h1>
				<div className="flex gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
						<Input
							placeholder="Search menu items..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button className="bg-indigo-600 hover:bg-indigo-700">
								<Plus className="mr-2 h-4 w-4" /> Add Item
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>
									{editingItem ? "Edit Menu Item" : "Add Menu Item"}
								</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<Input
									placeholder="Name"
									value={newItem.name}
									onChange={(e) =>
										setNewItem({ ...newItem, name: e.target.value })
									}
								/>
								<Input
									placeholder="Description"
									value={newItem.description}
									onChange={(e) =>
										setNewItem({ ...newItem, description: e.target.value })
									}
								/>
								<Input
									placeholder="Category"
									value={newItem.category}
									onChange={(e) =>
										setNewItem({ ...newItem, category: e.target.value })
									}
								/>
								<Input
									type="number"
									placeholder="Price"
									value={newItem.price}
									onChange={(e) =>
										setNewItem({ ...newItem, price: Number(e.target.value) })
									}
								/>
							</div>
							<Button onClick={editingItem ? updateItem : addItem} className="w-full">
								{editingItem ? "Update Item" : "Add Item"}
							</Button>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredItems.map((item) => (
						<TableRow key={item._id}>
							<TableCell>{item.name}</TableCell>
							<TableCell>{item.category}</TableCell>
							<TableCell>${item.price.toFixed(2)}</TableCell>
							<TableCell>
								{item.description.length > 20
									? item.description.slice(0, 20) + "..."
									: item.description}
							</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => openEditDialog(item)}
										className="hover:bg-indigo-100 dark:hover:bg-indigo-900"
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() => deleteItem(item._id)}
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

export default MenuManagement;
