/** @format */

import React from "react";

function Modal(props) {
	if (!props.isVisible) {
		return null;
	}

	const handleClose = (event) => {
		if (event.target.id === "wrapper") props.onClose();
	};

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
			id="wrapper"
			onClick={handleClose}
		>
			<div className="w-[800px] flex flex-col">
				<div className="flex justify-between items-center">
					<div></div>
					<button
						className="text-white text-2xl bg-red-500 w-10 h-10 rounded-full duration-300 hover:bg-red-600 -mr-8"
						onClick={() => props.onClose()}
					>
						X
					</button>
				</div>
				<div className="p-2 rounded w-full mt-2 m-auto">{props.children}</div>
			</div>
		</div>
	);
}

export default Modal;
