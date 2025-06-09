import moment from "moment";
import { useState, useEffect, useContext } from "react";

export const TermForm = ({ child: term, setChild: setTerm }) => {
	const update = (field, value) => {
		setTerm({ ...term, [field]: value });
	};

	return (
		<section id="term-form">
			<div className="input-wrapper grid">
				<div className="width-1-2">
					<label>Term Start</label>
					<input
						type="date"
						value={term.start}
						onInput={(e) => {
							update("start", e.target.value);
						}}
					/>
				</div>
				<div className="width-1-2">
					<label>Term End</label>
					<input
						type="date"
						value={term.end}
						onInput={(e) => {
							update("end", e.target.value);
						}}
					/>
				</div>
			</div>
		</section>
	);
};
