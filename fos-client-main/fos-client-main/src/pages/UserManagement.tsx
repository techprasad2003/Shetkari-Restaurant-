import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Edit, Trash2 } from "lucide-react";
import axios from "axios";

interface User {
	_id: string;
	username: string;
	role: "Admin" | "Receptionist" | "Kitchen";
}

const UserManagement: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [formData, setFormData] = useState({ username: "", password: "", role: "" });

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const res = await axios.get("https://fos-server-hfp4.onrender.com/api/user", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			setUsers(res.data);
			toast.success("Users fetched successfully!");
		} catch (error) {
			toast.error("Failed to fetch users.");
		}
	};

	const handleAddOrUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
			if (selectedUser) {
				await axios.put(
					`https://fos-server-hfp4.onrender.com/api/user/${selectedUser._id}`,
					formData,
					{
						headers,
					},
				);
				toast.success("User updated successfully!");
			} else {
				await axios.post("https://fos-server-hfp4.onrender.com/api/user", formData, {
					headers,
				});
				toast.success("User added successfully!");
			}
			fetchUsers();
			setIsDialogOpen(false);
			setFormData({ username: "", password: "", role: "" });
			setSelectedUser(null);
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to save user.");
		}
	};

	const handleDeleteUser = async (id: string) => {
		try {
			await axios.delete(`https://fos-server-hfp4.onrender.com/api/user/${id}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			toast.success("User deleted successfully!");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to delete user.");
		}
	};

	const openEditDialog = (user: User) => {
		setSelectedUser(user);
		setFormData({ username: user.username, password: "", role: user.role });
		setIsDialogOpen(true);
	};

	const filteredUsers = users.filter(
		(user) =>
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.role.toLowerCase().includes(searchTerm.toLowerCase()),
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
					User Management
				</h1>
				<div className="flex items-center space-x-4">
					<div className="relative">
						<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
						<Input
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button className="bg-indigo-600 hover:bg-indigo-700">Add User</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleAddOrUpdateUser} className="space-y-4">
								<div>
									<Label htmlFor="username">Username</Label>
									<Input
										id="username"
										value={formData.username}
										onChange={(e) =>
											setFormData({ ...formData, username: e.target.value })
										}
										placeholder="Enter username"
									/>
								</div>
								<div>
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										placeholder="Enter password"
									/>
								</div>
								<div>
									<Label htmlFor="role">Role</Label>
									<Select
										value={formData.role}
										onValueChange={(value) =>
											setFormData({ ...formData, role: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Admin">Admin</SelectItem>
											<SelectItem value="Receptionist">
												Receptionist
											</SelectItem>
											<SelectItem value="Kitchen">Kitchen</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button type="submit" className="w-full">
									{selectedUser ? "Update User" : "Add User"}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Username</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredUsers.map((user) => (
						<TableRow key={user._id}>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>
								<div className="flex space-x-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => openEditDialog(user)}
										className="hover:bg-indigo-100 dark:hover:bg-indigo-900"
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() => handleDeleteUser(user._id)}
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

export default UserManagement;
