/* client/src/pages/Home.tsx */
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="p-4 text-center"
		>
			<h1 className="text-3xl font-bold mb-4">Welcome to the Shetkari-FOS</h1>
			<p className="mb-6">Manage orders, menus, and bills for your hotel efficiently.</p>
			<div className="flex justify-center gap-4">
				<Button asChild>
					<Link to="/dashboard">Go to Dashboard</Link>
				</Button>
				<Button asChild variant="outline">
					<Link to="/order">Place an Order</Link>
				</Button>
			</div>
		</motion.div>
	);
};

export default Home;
