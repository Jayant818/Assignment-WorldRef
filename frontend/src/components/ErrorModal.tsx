interface ModalProps {
	message: string;
	onClose: () => void;
}

const ErrorModal = ({ message, onClose }: ModalProps) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 px-4">
			<div
				className="absolute inset-0 bg-black opacity-50"
				onClick={onClose}
			></div>
			<div className="bg-white text-black rounded-lg shadow-lg p-4 sm:p-6 z-10 w-full max-w-sm mx-auto">
				<p className="text-center mb-4">{message}</p>
				<button
					onClick={onClose}
					className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default ErrorModal;
