import moment from "moment";

import { useState, useEffect, useMemo } from "react";

export const DeadlineList = ({ items: deadlines, onDestory }) => {
	return deadlines.map((d, idx) => {
		return (
			<div className="term grid" key={idx}>
				<div className="width-1-12">
					<span
						data-uk-icon="trash"
						className="icon left-aligned clickable"
						onClick={() => {
							onDestory(d);
						}}
					></span>
				</div>
				<div className="width-8-12">{d.label}</div>
				<div className="width-3-12">{moment(d.deadline).format("M/D/YY")}</div>
			</div>
		);
	});
};
