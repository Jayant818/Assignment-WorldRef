import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/store";
import { BACKEND_URL } from "../constants";
import Navbar from "../components/shared/Navbar";
import { Task } from "./Tasks";
import { useAuthRedirect } from "../hooks/useAuthRedirects";

interface userProps {
	countryCode: string;
	email: string;
	id: number;
	imgUrl: string;
	phone: string;
	username: string;
}

const UserProfile = () => {
	const user: userProps = useAppSelector((store) => store.authReducer.user)!;
	console.log(user);
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
					credentials: "include",
				});
				const data = await response.json();
				setTasks(data.tasks);
			} catch (error) {
				console.error("Error fetching tasks:", error);
			}
		};

		fetchTasks();
	}, []);

	const isAuthenticated = useAuthRedirect();

	if (!user || !isAuthenticated) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="flex flex-row gap-2">
					<div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
					<div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"></div>
					<div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></div>
				</div>
			</div>
		);
	}

	return (
		<>
			<Navbar />
			<div className="container mx-auto mt-8 p-4">
				<div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-full md:max-w-xl mx-auto">
					<div className="flex flex-col md:flex-row items-center mb-6">
						<img
							src={user.imgUrl}
							alt="Profile"
							className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-4"
						/>
						<div className="text-center md:text-left">
							<h2 className="text-2xl font-bold text-white">{user.username}</h2>
							<p className="text-gray-400">{user.email}</p>
						</div>
					</div>
					<div className="mb-6">
						<h3 className="text-xl font-semibold text-white mb-2">
							Contact Information
						</h3>
						<p className="text-gray-400">
							Phone: {user.countryCode} {user.phone}
						</p>
					</div>
					<div>
						<h3 className="text-xl font-semibold text-white mb-2">
							Task Summary
						</h3>
						<p className="text-gray-400">Total Tasks: {tasks.length}</p>
						<p className="text-gray-400">
							Completed Tasks:
							{tasks.filter((task) => task.status === "COMPLETED").length}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserProfile;
