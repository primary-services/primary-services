import moment from "moment";
import { useState, useEffect, useContext } from "react";

import { SubForm } from "./subform.js";

import { DeadlineForm } from "./deadlines.js";
import { DeadlineList } from "../lists/deadlines.js";

import { FormForm } from "./forms.js";
import { FormList } from "../lists/forms.js";

import { RequirementForm } from "./requirements.js";
import { RequirementList } from "../lists/requirements.js";

export const TermForm = ({ child: term, setChild: setTerm }) => {
	const update = (field, value) => {
		setTerm({ ...term, [field]: value });
	};

	const [deadline, setDeadline] = useState(null);
	const [requirement, setRequirement] = useState(null);
	const [responsibility, setResponsibility] = useState(null);
	const [note, setNote] = useState(null);

	const saveDeadlines = (items) => {
		setTerm({
			...term,
			election: {
				...term.election,
				deadlines: items,
			},
		});
	};

	const validateDeadline = (d) => {
		// Stub
	};

	const saveForms = (items) => {
		setTerm({
			...term,
			election: {
				...term.election,
				forms: items,
			},
		});
	};

	const validateForm = (d) => {
		// Stub
	};

	const saveRequirements = (items) => {
		// TODO: Need to do a little more here to potentially save created form or deadline

		setTerm({
			...term,
			election: {
				...term.election,
				requirements: items,
			},
		});
	};

	const validateRequirement = (d) => {
		// Stub
	};

	const updateElection = (field, value) => {
		setTerm({
			...term,
			election: { ...term.election, [field]: value },
		});
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

			<div className="election">
				<div className="input-wrapper grid">
					<div className="width-1-2">
						<label>Next Election Date</label>
						<input
							type="date"
							value={term?.election?.polling_date || ""}
							onInput={(e) => updateElection("polling_date", e.target.value)}
						/>
					</div>
					<div className="width-1-2">
						<label>Seat Count</label>
						<input
							type="number"
							value={term?.election?.seat_count || ""}
							onInput={(e) => updateElection("seat_count", e.target.value)}
						/>
					</div>
				</div>

				<SubForm
					form={DeadlineForm}
					list={DeadlineList}
					label="Deadlines"
					items={term.election.deadlines}
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
					label="Forms"
					items={term.election.forms}
					template={{
						id: null,
						label: "",
						description: "",
						url: "",
					}}
					onSave={saveForms}
					onValidate={validateForm}
				/>

				<SubForm
					form={RequirementForm}
					list={RequirementList}
					label="Requirements"
					items={term.election.requirements}
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
			</div>
		</section>
	);
};
