import { useState, useEffect, useContext, useMemo } from "react";

import { OfficePicker } from "../components/office-picker.js";

export const ResidencyRequirement = ({ requirement, offices }) => {
	let [allOffices, setAllOffices] = useState(true);

	return (
		<div className="residency-requirement">
			<h4>Residency Requirment</h4>
			<div className="input-wrapper">
				<label>Must establish residency in</label>
				<select>
					<option>City/Town</option>
					<option>Ward</option>
				</select>
			</div>

			<div className="input-wrapper checkbox">
				<input
					type="checkbox"
					checked={allOffices}
					onChange={() => {
						setAllOffices(!allOffices);
					}}
				/>
				<label>Applies to all offices</label>
			</div>

			{!allOffices && (
				<OfficePicker
					requirement={requirement}
					offices={offices}
				></OfficePicker>
			)}
		</div>
	);
};
