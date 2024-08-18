import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../constants";
import { Task } from "../../screens/Tasks";
import Modal from "../Modal";
import TaskForm from "./TaskForm";

interface TaskItemsProps {
	task: Task;
	onUpdate: (updatedTask: Task) => void;
	onDelete: (taskId: number) => void;
}

const TaskItem = ({ task, onUpdate, onDelete }: TaskItemsProps) => {
	const [remainingTime, setRemainingTime] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setRemainingTime(getRemainingTime(task.dueDate));
		}, 1000);

		return () => clearInterval(timer);
	}, [task.dueDate]);

	const handleDelete = async () => {
		try {
			await fetch(`${BACKEND_URL}/api/v1/tasks/${task.id}`, {
				method: "DELETE",
				credentials: "include",
			});
			onDelete(task.id);
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleUpdate = (updatedTask: Task) => {
		onUpdate(updatedTask);
		setIsEditing(false);
	};

	const getRemainingTime = (dueDate: string) => {
		const due = new Date(dueDate).getTime();
		const now = Date.now();
		const difference = due - now;

		if (difference < 0) return "Overdue";
		if (difference < 60000) return `${Math.floor(difference / 1000)} seconds`;
		if (difference < 3600000)
			return `${Math.floor(difference / 60000)} minutes`;
		if (difference < 86400000)
			return `${Math.floor(difference / 3600000)} hours`;
		if (difference < 604800000)
			return `${Math.floor(difference / 86400000)} days`;
		if (difference < 2592000000)
			return `${Math.floor(difference / 604800000)} weeks`;
		return `${Math.floor(difference / 2592000000)} months`;
	};

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		};
		return new Date(dateString).toLocaleString(undefined, options);
	};

	const getStatusTextColor = (status: string) => {
		switch (status) {
			case "PENDING":
				return "text-yellow-500";
			case "IN_PROGRESS":
				return "text-blue-500";
			case "COMPLETED":
				return "text-green-500";
			default:
				return "text-white";
		}
	};

	return (
		<>
			<div className="flex flex-col md:flex-row justify-between items-start p-4 bg-gray-800 text-white rounded shadow-md mb-4">
				<div className="flex-1">
					<p
						className={`text-xs md:text-sm mt-2 ${getStatusTextColor(
							task.status
						)}`}
					>
						{task.status}
					</p>
					<h3 className="text-lg md:text-xl font-semibold">{task.title}</h3>
					<p className="text-sm md:text-base">{task.description}</p>
					<p className="text-xs md:text-sm mt-2">{`Due: ${formatDate(
						task.dueDate
					)}`}</p>
					<p className="text-xs md:text-sm mt-1 text-gray-400">
						{remainingTime}
					</p>
				</div>
				<div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
					<button
						onClick={handleEdit}
						className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded text-sm md:text-base"
					>
						Edit
					</button>
					<button
						onClick={handleDelete}
						className="bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded text-sm md:text-base"
					>
						Delete
					</button>
				</div>
			</div>
			<Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
				<TaskForm
					task={task}
					onClose={() => setIsEditing(false)}
					onSubmit={handleUpdate}
				/>
			</Modal>
		</>
	);
};

export default TaskItem;
