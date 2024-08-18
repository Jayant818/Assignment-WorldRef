import { useState, useEffect } from "react";
import { BACKEND_URL } from "../constants";

export const useUserData = () => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchTasks = async () => {
		try {
			setLoading(true);
			const tasksResponse = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const tasksData = await tasksResponse.json();
			setTasks(tasksData.tasks);
			setLoading(false);
		} catch (err) {
			// @ts-ignore
			setError(err.message);
			setLoading(false);
		}
	};

	// 	try {
	// 		const userResponse = await fetch(`${BACKEND_URL}/api/v1/user`, {
	// 			method: "GET",
	// 			credentials: "include",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		});
	// 		const userData = await userResponse.json();
	// 		setUser(userData.user);
	// 	} catch (err) {
	// 		setError(err.message);
	// 	}
	// };

	// Initial data fetch on component mount
	useEffect(() => {
		const fetchData = async () => {
			await fetchTasks();
		};

		fetchData();
	}, []);

	// refreshTasks function to manually refresh tasks
	const refreshTasks = async () => {
		await fetchTasks();
	};

	return { tasks, loading, error, refreshTasks };
};
