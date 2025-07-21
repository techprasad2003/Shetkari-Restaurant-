import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, User, LogIn } from "lucide-react";

const Login: React.FC<{ onLoginSuccess: (role: string) => void }> = ({ onLoginSuccess }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!username || !password) {
			toast.error("Please fill in all fields");
			return;
		}

		setIsLoading(true);
		try {
			const res = await axios.post("https://fos-server-hfp4.onrender.com/api/user/login", {
				username,
				password,
			});
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("role", res.data.role);
			onLoginSuccess(res.data.role);
			toast.success("Login successful!");
			navigate("/", { replace: true });
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6"
		>
			<Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
				<CardHeader className="text-center space-y-4">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3, delay: 0.2 }}
						className="mx-auto"
					>
						<LogIn className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
					</motion.div>
					<CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
						Welcome Back
					</CardTitle>
					<p className="text-gray-500 dark:text-gray-400 text-sm">
						Login to the Shetkari-FOS
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<form onSubmit={handleLogin} className="space-y-6">
						<div className="space-y-2">
							<Label
								htmlFor="username"
								className="text-sm font-medium text-gray-700 dark

:text-gray-300 flex items-center gap-2"
							>
								<User className="h-4 w-4" />
								Username
							</Label>
							<Input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter your username"
								className="h-11 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
							>
								<Lock className="h-4 w-4" />
								Password
							</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className="h-11 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
							/>
						</div>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
										/>
									</svg>
									Logging in...
								</>
							) : (
								<>
									<LogIn className="h-5 w-5" />
									Login
								</>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default Login;
