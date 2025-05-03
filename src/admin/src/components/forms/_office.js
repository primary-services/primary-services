import { useState, useEffect } from "react";

import { TermForm } from "./terms.js";
import { TermList } from "../lists/terms.js";
import { SubForm } from "./subform.js";

export const OfficeForm = ({ selected, onSave, onCancel }) => {
	let [office, setOffice] = useState({
		id: null,
		title: "",
		description: "",
		salary: 0,
		elected: true,
		min_hours: 0,
		max_hours: 0,
		terms: [],
	});

	useEffect(() => {
		if (selected){
			setOffice(prev => ({...prev, ...selected}))
		}
	}, [selected])

	let [term, setTerm] = useState(null);

	let [errors, setErrors] = useState({});

	const update = (field, value) => {
		setOffice({ ...office, [field]: value });
	};

	const saveTerms = (items) => {
		setOffice({
			...office,
			terms: items,
		});
	};

	const validateTerm = () => {};

	const save = () => {
		onSave(office);
	};

	const cancel = () => {
		onCancel();
	};

	return (
		<section id="office-form">
			<section className="office-description">
				<h3>Office Description</h3>
				<div className="input-wrapper uk-width-1-1">
					<label>Title</label>
					<input
						type="text"
						value={office.title}
						onInput={(e) => {
							update("title", e.target.value);
						}}
					/>
				</div>
				<div className="input-wrapper uk-width-1-1">
					<label>Description</label>
					<textarea
						value={office.description}
						rows="5"
						onInput={(e) => {
							update("description", e.target.value);
						}}
					></textarea>
				</div>
				<div className="input-wrapper grid">
					<div className="width-1-2">
						<label>Salary</label>
						<input
							type="number"
							value={office.salary}
							onInput={(e) => {
								update("salary", e.target.value);
							}}
						/>
					</div>
					<div className="width-1-4">
						<label>Min Hours</label>
						<input
							type="number"
							value={office.min_hours}
							onInput={(e) => {
								update("min_hours", e.target.value);
							}}
						/>
					</div>
					<div className="width-1-4">
						<label>Max Hours</label>
						<input
							type="number"
							value={office.max_hours}
							onInput={(e) => {
								update("max_hours", e.target.value);
							}}
						/>
					</div>
				</div>
			</section>

			{office.elected && <section className="terms">
				<SubForm
					form={TermForm}
					list={TermList}
					label="Terms"
					items={office.terms}
					template={{
						id: null,
						start: null,
						end: null,
						incumbents: [],
						election: {
							polling_date: null,
							seat_count: 1,
							candidates: [],
							deadlines: [],
							requirements: [],
							responsibilities: [],
							forms: [],
							notes: [],
						},
					}}
					onSave={saveTerms}
					onValidate={validateTerm}
				/>
			</section>}

			<section className="actions">
				<div className="btn blocky clicky" onClick={save}>
					Save
				</div>
				<div className="btn blocky clicky" onClick={cancel}>
					Cancel
				</div>
			</section>
		</section>
	);
};
