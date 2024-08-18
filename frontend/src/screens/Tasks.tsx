import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserData";
import Navbar from "../components/shared/Navbar";
import SearchBar from "../components/shared/SearchBar";
import { FaPlus } from "react-icons/fa6";
import TaskList from "../components/Tasks/TaskList";
import Modal from "../components/Modal";
import TaskForm from "../components/Tasks/TaskForm";
import { useAuthRedirect } from "../hooks/useAuthRedirects";

export interface Task {
	createdAt: string;
	description: string;
	dueDate: string;
	id: number;
	status: string;
	title: string;
	updatedAt: string;
	userId: number;
}

const Tasks = () => {
	const { tasks, loading, error, refreshTasks } = useUserData();
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortOrder, setSortOrder] = useState<string>("");
	const [filter, setFilter] = useState<string>("all");
	const navigate = useNavigate();
	const [isAddingTask, setIsAddingTask] = useState(false);

	const filterTasks = (tasks: Task[]) => {
		const now = new Date();
		const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		const oneMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

		switch (filter) {
			case "week":
				return tasks.filter((task) => new Date(task.dueDate) <= oneWeek);
			case "month":
				return tasks.filter((task) => new Date(task.dueDate) <= oneMonth);
			case "overdue":
				return tasks.filter((task) => new Date(task.dueDate) < now);
			default:
				return tasks;
		}
	};

	const filteredTasks = filterTasks(tasks).filter((task: Task) =>
		task.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const sortedTasks = [...filteredTasks].sort((a: Task, b: Task) => {
		if (sortOrder === "soonest") {
			return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
		} else if (sortOrder === "latest") {
			return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
		}
		return 0;
	});

	const calculateProgress = (tasks: Task[]) => {
		return tasks.reduce((score, task) => {
			const isCompleted = task.status === "COMPLETED";
			const isBeforeDeadline = new Date(task.dueDate) > new Date();

			if (isCompleted) {
				if (isBeforeDeadline) {
					return score + 1;
				} else {
					return score - 0.5;
				}
			}
			if (!isBeforeDeadline && !isCompleted) {
				return score - 0.5;
			}
			return score;
		}, 0);
	};

	const progress = calculateProgress(sortedTasks);

	const handleAddTask = async () => {
		await refreshTasks();
	};

	const handleUpdateTask = async () => {
		await refreshTasks();
	};

	const handleDeleteTask = async () => {
		await refreshTasks();
	};

	const isAuthenticated = useAuthRedirect();

	if (loading || !isAuthenticated) {
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

	if (error) {
		setInterval(() => {
			navigate("/");
		}, 3000);
		return (
			<div className="h-screen flex justify-center items-center">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="pb-4">
			<Navbar />
			<div className="mt-4 px-4 md:px-20">
				<div className="flex flex-col gap-6">
					<SearchBar onSearch={(query) => setSearchQuery(query)} />
					<div className="flex flex-col md:flex-row gap-4 items-center">
						<div className="w-full md:w-40">
							<select
								id="sort"
								value={sortOrder}
								onChange={(e) => setSortOrder(e.target.value)}
								className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-white"
							>
								<option value="soonest">By Soonest</option>
								<option value="latest">By Latest</option>
							</select>
						</div>
						<div className="w-full md:w-40">
							<select
								id="filter"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-white"
							>
								<option value="all">All Tasks</option>
								<option value="week">Due in a week</option>
								<option value="month">Due in a month</option>
								<option value="overdue">Overdue</option>
							</select>
						</div>
						<button
							onClick={() => setIsAddingTask(true)}
							className="text-red-500 bg-transparent border-none flex gap-2 items-center"
						>
							<FaPlus className="text-red-500" />
							<p>Add a Task</p>
						</button>
					</div>
					<div className="mt-4 p-6 rounded-lg shadow-lg w-full md:w-fit bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
						<h6 className="text-lg font-semibold mb-2">Your Progress</h6>
						<div className="flex items-center space-x-4">
							<div className="relative w-32 h-2 bg-gray-300 rounded">
								<div
									className="absolute top-0 left-0 h-2 bg-yellow-400 rounded"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<span className="text-xl font-bold">{progress}%</span>
						</div>
					</div>
				</div>
				<TaskList
					tasks={sortedTasks}
					onUpdate={handleUpdateTask}
					onDelete={handleDeleteTask}
				/>
			</div>
			<Modal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)}>
				<TaskForm
					onClose={() => setIsAddingTask(false)}
					onSubmit={handleAddTask}
				/>
			</Modal>
		</div>
	);
};

export default Tasks;
