import moment from "moment";

import { useState, useEffect, useMemo } from "react";

export const RequirementList = ({ items: requirements, onDestory }) => {
	return requirements.map((d, idx) => {
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
				<div className="width-7-12">{d.label}</div>
				<div className="width-4-12">Form</div>
			</div>
		);
	});
};
