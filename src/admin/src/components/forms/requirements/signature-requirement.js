import { useState, useEffect, useContext, useMemo } from "react";

import { OfficePicker } from "../components/office-picker.js";

export const SignatureRequirement = ({ requirement, offices, update }) => {
	let [allOffices, setAllOffices] = useState(true);

	const handleUpdate = (field, e) => {
		update(requirement, field, e.target.value);
	};

	const toggleOffice = (id) => {
		if (requirement.offices.includes(id)) {
			update(
				requirement,
				"offices",
				requirement.offices.filter((o) => o !== id),
			);
		} else {
			update(requirement, "offices", [...requirement.offices, id]);
		}
	};

	return (
		<div className="signature-requirement">
			<h4>Required Signatures</h4>
			<div className="input-wrapper">
				<label>Number of Signatures to Collect</label>
				<input
					type="number"
					min="0"
					max="1000000"
					step="1"
					value={requirement.value}
					onInput={(e) => {
						handleUpdate("value", e);
					}}
				/>
			</div>

			<div className="input-wrapper">
				<label>Signatures must be gathered by</label>
				<input
					type="date"
					value={requirement.deadline}
					onInput={(e) => {
						handleUpdate("deadline", e);
					}}
				/>
			</div>

			<div className="input-wrapper">
				<label>Signature form</label>
				<input
					type="url"
					value={requirement.form}
					onInput={(e) => {
						handleUpdate("form", e);
					}}
				/>
			</div>

			<div className="input-wrapper">
				<label>Additional Information</label>
				<textarea
					value={requirement.addition_information}
					rows="3"
					onInput={(e) => {
						handleUpdate("addition_information", e);
					}}
				></textarea>
			</div>

			<div className="input-wrapper checkbox">
				<input
					key={Math.random()}
					type="checkbox"
					defaultChecked={allOffices}
					onClick={() => {
						setAllOffices(!allOffices);
					}}
				/>
				<label>Applies to all offices</label>
			</div>

			{!allOffices && (
				<OfficePicker
					requirement={requirement}
					offices={offices}
					toggle={toggleOffice}
				></OfficePicker>
			)}
		</div>
	);
};
