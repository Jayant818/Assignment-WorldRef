import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../../constants";
import { Task } from "../../screens/Tasks";

enum todoTask {
	PENDING = "PENDING",
	COMPLETED = "COMPLETED",
	IN_PROGRESS = "IN_PROGRESS",
}

interface TaskFormProps {
	task?: Task;
	onClose: () => void;
	onSubmit: (task: Task) => void;
}

const TaskForm = ({ task, onClose, onSubmit }: TaskFormProps) => {
	const [title, setTitle] = useState(task?.title || "");
	const [description, setDescription] = useState(task?.description || "");
	const [dueDate, setDueDate] = useState(task?.dueDate?.slice(0, 16) || "");
	const [status, setStatus] = useState(task?.status || todoTask.PENDING);
	const [error, setError] = useState("");

	useEffect(() => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description);
			setDueDate(task.dueDate.slice(0, 16));
			setStatus(task.status as todoTask);
		}
	}, [task]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const now = new Date();
		const selectedDate = new Date(dueDate);

		if (selectedDate < now) {
			setError("Due date and time cannot be in the past.");
			return;
		}

		try {
			const url = task
				? `${BACKEND_URL}/api/v1/tasks/${task.id}`
				: `${BACKEND_URL}/api/v1/tasks`;
			const method = task ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, description, dueDate, status }),
			});

			if (response.ok) {
				const data = await response.json();
				onSubmit(data.task);
				onClose();
			} else {
				console.error("Failed to submit task");
			}
		} catch (error) {
			console.error("Error submitting task:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h2 className="text-xl font-bold text-white">
				{task ? "Edit Task" : "Add New Task"}
			</h2>

			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
				className="w-full p-2 bg-gray-700 text-white rounded"
				required
			/>

			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description"
				className="w-full p-2 bg-gray-700 text-white rounded"
				required
			/>

			<input
				type="datetime-local"
				value={dueDate}
				placeholder="Due Date"
				onChange={(e) => setDueDate(e.target.value)}
				className="w-full p-2 bg-gray-700 text-white rounded"
				required
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}

			<select
				value={status}
				onChange={(e) => setStatus(e.target.value as todoTask)}
				className="w-full p-2 bg-gray-700 text-white rounded"
			>
				<option value={todoTask.PENDING}>Pending</option>
				<option value={todoTask.IN_PROGRESS}>In Progress</option>
				<option value={todoTask.COMPLETED}>Completed</option>
			</select>

			<div className="flex justify-end space-x-2">
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2 bg-red-600 text-white rounded"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded"
				>
					{task ? "Update Task" : "Add Task"}
				</button>
			</div>
		</form>
	);
};

export default TaskForm;
