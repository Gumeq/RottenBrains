import React from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-lg border-2 border-accent">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">{title}</h2>
					<button onClick={onClose} className="text-xl font-bold">
						&times;
					</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
