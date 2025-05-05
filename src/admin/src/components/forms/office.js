import { useState, useEffect } from "react";

import { SeatForm } from "./seats.js";
import { SeatList } from "../lists/seats.js";
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
		seats: [],
	});

	useEffect(() => {
		if (selected) {
			setOffice((prev) => ({ ...prev, ...selected }));
		}
	}, [selected]);

	let [seat, setSeat] = useState(null);
	let [errors, setErrors] = useState({});

	const update = (field, value) => {
		setOffice({ ...office, [field]: value });
	};

	const saveSeat = (items) => {
		setOffice({
			...office,
			seats: items,
		});
	};

	const validateSeat = () => {};

	const save = () => {
		console.log("Office Form:", office);
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

			{office.elected && (
				<section className="seats">
					<SubForm
						form={SeatForm}
						list={SeatList}
						label="Seats"
						items={office.seats}
						template={{
							id: null,
							name: "",
							terms: [],
						}}
						onSave={saveSeat}
						onValidate={validateSeat}
					/>
				</section>
			)}

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
