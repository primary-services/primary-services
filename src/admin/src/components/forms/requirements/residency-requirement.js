import { useState, useEffect, useContext, useMemo } from "react";

import { OfficePicker } from "../components/office-picker.js";

export const ResidencyRequirement = ({ requirement, offices, update }) => {
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
		<div className="residency-requirement">
			<h4>Residency Requirment</h4>
			<div className="input-wrapper">
				<label>Must establish residency in</label>
				<select
					onInput={(e) => {
						handleUpdate("value", e);
					}}
				>
					<option>City/Town</option>
					<option>Ward</option>
				</select>
			</div>

			<div className="input-wrapper">
				<label>Must establish residency by</label>
				<input
					type="date"
					value={requirement.deadline}
					onInput={(e) => {
						handleUpdate("deadline", e);
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
