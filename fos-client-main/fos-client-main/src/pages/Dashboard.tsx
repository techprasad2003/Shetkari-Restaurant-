import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
);

interface DashboardData {
	dailyOrders: number;
	pendingOrders: number;
	preparingOrders: number;
	totalEarnings: number;
}

const Dashboard: React.FC = () => {
	const [data, setData] = useState<DashboardData>({
		dailyOrders: 0,
		pendingOrders: 0,
		preparingOrders: 0,
		totalEarnings: 0,
	});

	useEffect(() => {
		axios
			.get("https://fos-server-hfp4.onrender.com/api/dashboard", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			})
			.then((res) => setData(res.data))
			.catch((err) => console.error("Error fetching dashboard data:", err));
	}, []);

	const barChartData = {
		labels: ["Daily Orders"],
		datasets: [
			{
				label: "Orders",
				data: [data.dailyOrders],
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	const doughnutChartData = {
		labels: ["Pending", "Preparing", "Completed"],
		datasets: [
			{
				data: [
					data.pendingOrders,
					data.preparingOrders,
					Math.max(0, data.dailyOrders - data.pendingOrders - data.preparingOrders),
				],
				backgroundColor: [
					"rgba(255, 99, 132, 0.6)",
					"rgba(54, 162, 235, 0.6)",
					"rgba(75, 192, 192, 0.6)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(75, 192, 192, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	const lineChartData = {
		labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
		datasets: [
			{
				label: "Earnings ($)",
				data: [
					data.totalEarnings * 0.8,
					data.totalEarnings * 0.9,
					data.totalEarnings,
					data.totalEarnings * 1.1,
					data.totalEarnings * 1.2,
				],
				fill: false,
				borderColor: "rgba(153, 102, 255, 1)",
				tension: 0.3,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
				labels: {
					color: "#4B5563",
					usePointStyle: true,
				},
			},
			tooltip: {
				backgroundColor: "rgba(0, 0, 0, 0.8)",
				titleColor: "#ffffff",
				bodyColor: "#ffffff",
			},
		},
		scales: {
			x: {
				ticks: {
					color: "#4B5563",
				},
				grid: {
					color: "rgba(0, 0, 0, 0.1)",
				},
			},
			y: {
				ticks: {
					color: "#4B5563",
				},
				grid: {
					color: "rgba(0, 0, 0, 0.1)",
				},
			},
		},
	};

	const darkChartOptions = {
		...chartOptions,
		plugins: {
			...chartOptions.plugins,
			legend: {
				...chartOptions.plugins.legend,
				labels: {
					...chartOptions.plugins.legend.labels,
					color: "#D1D5DB",
				},
			},
		},
		scales: {
			x: {
				...chartOptions.scales.x,
				ticks: {
					color: "#D1D5DB",
				},
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
			},
			y: {
				...chartOptions.scales.y,
				ticks: {
					color: "#D1D5DB",
				},
				grid: {
					color: "rgba(255, 255, 255, 0.1)",
				},
			},
		},
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6"
		>
			<div className="max-w-7xl mx-auto">
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-center space-x-4"
					>
						<div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-full">
							<svg
								className="w-8 h-8 text-teal-600 dark:text-teal-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
								Daily Orders
							</h2>
							<p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
								{data.dailyOrders}
							</p>
						</div>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.05 }}
						className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-center space-x-4"
					>
						<div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
							<svg
								className="w-8 h-8 text-red-600 dark:text-red-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
								Pending Orders
							</h2>
							<p className="text-3xl font-bold text-red-600 dark:text-red-400">
								{data.pendingOrders}
							</p>
						</div>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.05 }}
						className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-center space-x-4"
					>
						<div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
							<svg
								className="w-8 h-8 text-purple-600 dark:text-purple-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
								Total Earnings
							</h2>
							<p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
								${data.totalEarnings}
							</p>
						</div>
					</motion.div>
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
					>
						<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
							Daily Orders
						</h2>
						<div className="h-64">
							<Bar
								data={barChartData}
								options={
									document.documentElement.classList.contains("dark")
										? darkChartOptions
										: chartOptions
								}
							/>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
					>
						<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
							Order Status
						</h2>
						<div className="h-64">
							<Doughnut
								data={doughnutChartData}
								options={
									document.documentElement.classList.contains("dark")
										? darkChartOptions
										: chartOptions
								}
							/>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2"
					>
						<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
							Earnings Trend
						</h2>
						<div className="h-80">
							<Line
								data={lineChartData}
								options={
									document.documentElement.classList.contains("dark")
										? darkChartOptions
										: chartOptions
								}
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default Dashboard;
