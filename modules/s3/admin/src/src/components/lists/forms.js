import moment from "moment";

import { useState, useEffect, useMemo } from "react";

export const FormList = ({ items: forms, onDestory }) => {
	return forms.map((f, idx) => {
		return (
			<div className="term grid" key={idx}>
				<div className="width-1-12">
					<span
						data-uk-icon="trash"
						className="icon left-aligned clickable"
						onClick={() => {
							onDestory(f);
						}}
					></span>
				</div>
				<div className="width-8-12">{f.label}</div>
				<div className="width-3-12">
					<a href={f.url} target="_blank">
						{f.url}
					</a>
				</div>
			</div>
		);
	});
};
