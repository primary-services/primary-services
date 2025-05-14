import moment from "moment";
import { useState, useEffect, useContext, useMemo } from "react";

import { SubForm } from "./subform.js";

import { DeadlineForm } from "./deadlines.js";
import { DeadlineList } from "../lists/deadlines.js";

import { FormForm } from "./forms.js";
import { FormList } from "../lists/forms.js";

import { RequirementForm } from "./requirements.js";
import { RequirementList } from "../lists/requirements.js";

import { useMunicipalityOffices } from "../../api-hooks.js";

export const ElectionForm = ({ selected, municipality, onSave, onCancel }) => {
	const { data: offices } = useMunicipalityOffices(municipality?.id);

	const [election, setElection] = useState({
		id: null,
		polling_date: null,
		deadlines: [],
		requirements: [],
		forms: [],
		terms: [],
	});

	useEffect(() => {
		setElection({ ...election, ...JSON.parse(JSON.stringify(selected)) });
	}, [selected]);

	const [office, setOffice] = useState(null);
	const [seats, setSeats] = useState([]);

	const getOffice = (id) => {
		return offices.find((o) => +o.id === +id);
	};

	const officeSeats = useMemo(() => {
		return !office ? [] : office.seats;
	}, [office]);

	const nextTerms = useMemo(() => {
		return !office
			? {}
			: (office.seats || []).reduce((a, c) => {
					let sorted = (c.terms || []).sort(
						(a, b) =>
							moment(b.start, "YYYY-MM-DD").valueOf() -
							moment(a.start, "YYYY-MM-DD").valueOf(),
					);

					a[c.id] = sorted[0]?.id || null;

					return a;
				}, {});
	}, [office]);

	const update = (field, value) => {
		setElection({ ...election, [field]: value });
	};

	const updateTerms = (options) => {
		let values = [...options].map((o) => {
			let seat = office.seats.find((s) => {
				return s.terms.find((t) => +t.id === +o.value);
			});

			return seat.terms.find((t) => +t.id === +o.value);
		});

		setElection({
			...election,
			terms: values.filter((v) => !!v),
		});
	};

	const [deadline, setDeadline] = useState(null);
	const [requirement, setRequirement] = useState(null);
	const [responsibility, setResponsibility] = useState(null);

	const saveDeadlines = (items) => {
		setElection({
			...election,
			deadlines: items,
		});
	};

	const validateDeadline = (d) => {
		// Stub
	};

	const saveForms = (items) => {
		setElection({
			...election,
			forms: items,
		});
	};

	const validateForm = (d) => {
		// Stub
	};

	const saveRequirements = (items) => {
		setElection({
			...election,
			requirements: items,
		});
	};

	const validateRequirement = (d) => {
		// Stub
	};

	const save = () => {
		console.log("Election:", election);
		onSave(election);
	};

	const cancel = () => {
		onCancel();
	};

	return (
		<section id="election-form">
			<div className="election">
				<div className="input-wrapper grid">
					<div className="width-1-1">
						<label>Office</label>
						<select
							value={office?.id || null}
							onInput={(e) => setOffice(getOffice(e.target.value))}
						>
							<option value={null}>Select an Office</option>
							{(offices || []).map((o) => {
								return <option value={o.id}>{o.title}</option>;
							})}
						</select>
					</div>
				</div>
				<div className="input-wrapper grid">
					<div className="width-1-1">
						<label>Seat(s)</label>
						<select
							onInput={(e) => updateTerms(e.target.selectedOptions)}
							multiple
						>
							<option value={null}>Select one or more seats</option>
							{(officeSeats || []).map((s) => {
								return <option value={nextTerms[s.id]}>{s.name}</option>;
							})}
						</select>
					</div>
				</div>
				<div className="input-wrapper grid">
					<div className="width-1-1">
						<label>Election Date</label>
						<input
							type="date"
							value={election?.polling_date || ""}
							onInput={(e) => update("polling_date", e.target.value)}
						/>
					</div>
				</div>

				<SubForm
					form={RequirementForm}
					list={RequirementList}
					label="Requirements"
					items={election?.requirements || []}
					template={{
						id: null,
						label: "",
						description: "",
						form: null,
						deadline: null,
					}}
					onSave={saveRequirements}
					onValidate={validateRequirement}
				/>

				<SubForm
					form={DeadlineForm}
					list={DeadlineList}
					label="Additional Deadlines"
					items={election?.deadlines || []}
					template={{
						id: null,
						label: "",
						description: "",
						deadline: null,
					}}
					onSave={saveDeadlines}
					onValidate={validateDeadline}
				/>

				<SubForm
					form={FormForm}
					list={FormList}
					label="Addition Forms"
					items={election?.forms || []}
					template={{
						id: null,
						label: "",
						description: "",
						url: "",
					}}
					onSave={saveForms}
					onValidate={validateForm}
				/>
			</div>

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
