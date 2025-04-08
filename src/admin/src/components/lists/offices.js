import moment from "moment";

import { useState, useEffect, useMemo } from "react";

export const OfficeList = ({ items: offices, onEdit, onDestory }) => {
	if (!offices) {
		return null;
	}

	return offices.map((o, idx) => {
		return (
			<div className="term grid" key={idx}>
				<div className="width-1-12">
					<span
						data-uk-icon="trash"
						className="icon left-aligned clickable"
						onClick={() => {
							onDestory(o);
						}}
					></span>
					<span
						data-uk-icon="pencil"
						className="icon left-aligned clickable"
						onClick={() => {
							onEdit(o);
						}}
					></span>
				</div>
				<div className="width-8-12">{o.title}</div>
			</div>
		);
	});
};
