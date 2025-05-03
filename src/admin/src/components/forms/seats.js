import moment from "moment";
import { useState, useEffect, useContext } from "react";

import { TermForm } from "./terms.js";
import { TermList } from "../lists/terms.js";

import { SubForm } from "./subform.js";

export const SeatForm = ({ child: seat, setChild: setSeat }) => {
	const update = (field, value) => {
		setSeat({ ...seat, [field]: value });
	};

	const [term, setTerm] = useState(null);

	const saveTerms = (items) => {
		setSeat({
			...seat,
			terms: [...items],
		});
	};

	const validateTerms = (terms) => {
		// Stub
	};

	return (
		<section id="term-form">
			<div className="input-wrapper grid">
				<div className="width-1-2">
					<label>Name</label>
					<input
						type="text"
						value={seat.name}
						onInput={(e) => {
							update("name", e.target.value);
						}}
					/>
				</div>
			</div>

			<div className="terms">
				<SubForm
					form={TermForm}
					list={TermList}
					label="Terms"
					items={seat.terms || []}
					template={{
						id: null,
						start: "",
						end: "",
					}}
					onSave={saveTerms}
					onValidate={validateTerms}
				/>
			</div>
		</section>
	);
};
