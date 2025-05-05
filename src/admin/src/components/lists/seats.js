import moment from "moment";

import { useState, useEffect, useMemo } from "react";

export const SeatList = ({ items: seats, onDestory }) => {
	const nextTerm = (s) => {
		console.log(s);

		return {
			start: "2025-01-25",
			end: "2025-01-26",
		};
	};

	return seats.map((s, idx) => {
		return (
			<div className="term grid" key={idx}>
				<div className="width-1-12">
					<span
						data-uk-icon="trash"
						className="icon left-aligned clickable"
						onClick={() => {
							onDestory(s);
						}}
					></span>
				</div>
				<div className="width-5-12">{s.name}</div>
				<div className="width-3-12">{nextTerm(s).start}</div>
				<div className="width-3-12">{nextTerm(s).end}</div>
			</div>
		);
	});
};
