import moment from "moment";

import { useState, useEffect, useMemo } from "react";

export const SeatList = ({ items: seats, onDestory }) => {
	const nextTerm = (seat) => {
		let { terms } = seat;

		if (!terms) {
			return null;
		}

		const sortedTerms = terms
			.sort(
				(a, b) =>
					new moment(a.start, "YYYY-MM-DD").valueOf() -
					new moment(b.start, "YYYY-MM-DD").valueOf(),
			)
			.filter((t) => {
				let end = moment(t.end, "YYYY-MM-DD").valueOf();
				let now = moment().valueOf();
				return end - now > 0;
			});

		return sortedTerms[0] || null;
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
				<div className="width-3-12">{nextTerm(s)?.start || "N/A"}</div>
				<div className="width-3-12">{nextTerm(s)?.end || "N/A"}</div>
			</div>
		);
	});
};
