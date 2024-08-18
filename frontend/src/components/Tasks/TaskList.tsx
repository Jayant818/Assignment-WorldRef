import TaskItem from "./TaskItem";
import { Task } from "../../screens/Tasks";

interface TaskListProps {
	tasks: Task[];
	onUpdate: (updatedTask: Task) => void;
	onDelete: (taskId: number) => void;
}

const TaskList = ({ tasks, onUpdate, onDelete }: TaskListProps) => {
	return (
		<div className="mt-4 ">
			{tasks.length === 0 ? (
				<p className="text-gray-500 text-center">No tasks available.</p>
			) : (
				<div className="space-y-4">
					{tasks.map((task) => (
						<TaskItem
							key={task.id}
							task={task}
							onUpdate={onUpdate}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default TaskList;
