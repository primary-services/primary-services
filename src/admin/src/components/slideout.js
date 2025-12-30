import { useState, useEffect } from "react";

export const Slideout = ({ children, active, setActive }) => {
	return (
		<div
			className={`slideout ${active ? "active" : ""}`}
			onClick={() => {
				//setActive(false);
			}}
		>
			<div
				className="slideout-wrapper"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<div className="slideout-content">{children}</div>
			</div>
		</div>
	);
};
