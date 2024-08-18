import React from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-gray-800 p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
				<div className="flex justify-end">
					<button onClick={onClose} className="text-gray-400 hover:text-white">
						×
					</button>
				</div>
				{children}
			</div>
		</div>
	);
};

export default Modal;
