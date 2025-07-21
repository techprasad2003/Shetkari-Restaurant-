import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Utensils,
  ShoppingCart,
  ChefHat,
  DollarSign,
  BarChart2,
  Users,
  Moon,
  Sun,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import MenuManagement from "./pages/MenuManagement";
import OrderPlacement from "./pages/OrderPlacement";
import OrderManagement from "./pages/OrderManagement";
import Billing from "./pages/Billing";
import Dashboard from "./pages/Dashboard";
import GuestManagement from "./pages/GuestManagement";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = theme === "dark" || (theme === "system" && systemPrefersDark);

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleThemeChange = (newTheme: any) => {
    setTheme(newTheme);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole("");
  };

  const handleLoginSuccess = (role: string) => {
    setIsAuthenticated(true);
    setRole(role);
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: BarChart2, roles: ["Admin"] },
    { path: "/menu", label: "Menu Management", icon: Utensils, roles: ["Admin"] },
    {
      path: "/order",
      label: "Order Placement",
      icon: ShoppingCart,
      roles: ["Admin", "Receptionist"],
    },
    { path: "/kitchen", label: "Order Management", icon: ChefHat, roles: ["Admin", "Kitchen"] },
    { path: "/billing", label: "Billing", icon: DollarSign, roles: ["Admin", "Receptionist"] },
    {
      path: "/guests",
      label: "Guest Management",
      icon: Users,
      roles: ["Admin", "Receptionist"],
    },
    { path: "/users", label: "User Management", icon: UserPlus, roles: ["Admin"] },
  ];

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    );
  }

  return (
		<BrowserRouter>
			<div
				className={cn(
					"min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors flex",
					theme === "dark" ||
						(theme === "system" &&
							window.matchMedia("(prefers-color-scheme: dark)").matches &&
							"dark"),
				)}
			>
				<AnimatePresence>
					{isSidebarOpen && (
						<motion.aside
							initial={{ x: isMobile ? "-100%" : 0 }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ duration: 0.3 }}
							className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 md:static md:block"
						>
							<div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
								<h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
									Shetkari-FOS
								</h2>
								{isMobile && (
									<Button
										variant="ghost"
										size="icon"
										onClick={toggleSidebar}
										className="md:hidden"
									>
										<X className="h-5 w-5" />
									</Button>
								)}
							</div>
							<ScrollArea className="h-[calc(100vh-4rem)]">
								<nav className="p-2">
									{navItems
										.filter((item) => item.roles.includes(role))
										.map((item) => (
											<Link
												key={item.path}
												to={item.path}
												onClick={() => isMobile && setIsSidebarOpen(false)}
											>
												<Button
													variant="ghost"
													className="w-full justify-start mb-1 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
												>
													<item.icon className="mr-2 h-5 w-5" />
													{item.label}
												</Button>
											</Link>
										))}
									<Button
										variant="ghost"
										className="w-full justify-start mb-1 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900"
										onClick={handleLogout}
									>
										<X className="mr-2 h-5 w-5" />
										Logout
									</Button>
								</nav>
							</ScrollArea>
						</motion.aside>
					)}
				</AnimatePresence>

				<div className={cn("flex-1", !isMobile && "ml-0")}>
					<header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
						{isMobile && (
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleSidebar}
								className="md:hidden"
							>
								<Menu className="h-6 w-6" />
							</Button>
						)}
						<h1 className="text-xl font-semibold text-white dark:text-gray-800">
							Shetkari-FOS
						</h1>
						<div className="relative" ref={dropdownRef}>
							<Button
								variant="ghost"
								onClick={toggleDropdown}
								className="flex items-center gap-1 px-3"
							>
								{theme === "dark" ||
								(theme === "system" &&
									window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
									<Moon className="h-5 w-5" />
								) : (
									<Sun className="h-5 w-5" />
								)}
								<ChevronDown className="h-4 w-4" />
							</Button>
							{isDropdownOpen && (
								<div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
									<div className="p-1">
										<button
											className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
											onClick={() => handleThemeChange("light")}
										>
											Light
										</button>
										<button
											className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
											onClick={() => handleThemeChange("dark")}
										>
											Dark
										</button>
										<button
											className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
											onClick={() => handleThemeChange("system")}
										>
											System
										</button>
									</div>
								</div>
							)}
						</div>
					</header>
					<motion.main
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="p-6"
					>
						<Routes>
							<Route path="/" element={<HomePage />} />
							{role === "Admin" && (
								<Route path="/dashboard" element={<Dashboard />} />
							)}
							{role === "Admin" && (
								<Route path="/menu" element={<MenuManagement />} />
							)}
							{(role === "Admin" || role === "Receptionist") && (
								<Route path="/order" element={<OrderPlacement />} />
							)}
							{(role === "Admin" || role === "Kitchen") && (
								<Route path="/kitchen" element={<OrderManagement />} />
							)}
							{(role === "Admin" || role === "Receptionist") && (
								<Route path="/billing" element={<Billing />} />
							)}
							{(role === "Admin" || role === "Receptionist") && (
								<Route path="/guests" element={<GuestManagement />} />
							)}
							{role === "Admin" && (
								<Route path="/users" element={<UserManagement />} />
							)}
							<Route path="*" element={<Navigate to="/" />} />
						</Routes>
					</motion.main>
				</div>
				<Toaster />
			</div>
		</BrowserRouter>
  );
}