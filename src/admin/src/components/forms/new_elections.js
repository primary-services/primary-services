/**
 * Seats in this ballot [checklist, prefilled]
 *
 * Election date
 * Election type
 * 	- Simple Majority
 * 	- Ranked Choice
 * 	- Multi Winner (Default)
 * 	-- How man winners per position (should be able to autofill, but it might vary based on vacancies)
 *
 * Peliminary/Primary Election [Select One?]
 *  - Date
 *  - Type
 *  -- None (Default)
 * 	-- Primary
 * 	-- Cacus
 *  -- Elimination (Somerville like system, don't know what to call it)
 *  --- Which seats does this apply to (probably always)
 *
 * Requirements
 * 	- Residency (Should be autofilled)
 * 		- Town (Default)
 * 		- District (This seems rare)
 * 		- Ward (Default if there are wards)
 * 		-- Applicable Offices
 * 	- Signatures
 * 		- Deadline
 * 		- Count
 * 	- Finance Requirements
 * 		- Autofill Campaign Finance Report (probably always http://files.ocpf.us/pdf/forms/M102_edit.pdf)
 * 		-- Deadlines (Usually multiple)
 * 		--- Applicable Offices
 * 	 	-- Guideance (Where to file, etc...)
 * 	 	- Other?
 * 	- Ethics
 * 		- (Heard something about this, not sure if it's standard)
 * 	- Professional/Technical requirements
 * 		- Probably none, but maybe?
 * 		-- Applicable offices
 * 	- Deadlines
 * 		- Filing Deadline (auto populated)
 * 		- Voter Registration Deadline (optional)
 * 		- Peliminary Election (if applicable, auto populated)
 * 		- Campaign Finance Reporting (auto-populate from above?)
 * 		- Election (auto-populate)
 * 		- Term Start (auto-populate from municipal data (which needs to be ))
 */

import moment from "moment";

import { useState, useEffect, useMemo, useContext } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";

import { AppContexts } from "../../providers";
// import { TownForm } from "../components/forms/town.js";
import { useMunicipality, useMunicipalityOffices } from "../../api-hooks.js";

import { useCreateNote, useDeleteNote } from "../../api/hooks/note.hooks.js";
import {
	useCreateSource,
	useDeleteSource,
} from "../../api/hooks/source.hooks.js";
import { useToggleFlag } from "../../api/hooks/utils.hooks.js";

import {
	cleanDateString,
	arr,
	obj,
	confirm,
	showNotification,
	confirmDeleteThen,
} from "../../utils.js";

import historyIcon from "../../icons/history.svg";

export const ElectionForm = ({ town, offices, wards, onSave, onCancel }) => {
	const requirementOptions = {
		residency: ["town/city", "ward", "district"],
	};

	const [election, setElection] = useState({
		election_date: moment().format("YYYY-MM-DD"),
		election_type: "multiple_winner",
		offices: (offices || []).reduce((a, c) => {
			let ending = c.seats.filter((s) => {
				return !!s.terms.find((t) => t.end_year === moment().format("YYYY"));
			});

			a[c.id] = ending.length;

			return a;
		}, {}),
		peliminary: {
			election_type: "none",
			election_date: null,
			offices: (offices || []).reduce((a, c) => {
				a[c.id] = 0;
				return a;
			}, {}),
		},
		requirements: [
			{
				type: "residency",
				value: !!wards ? "ward" : "town/city",
				label: "Residency Requirements",
				addition_information: "",
				deadlines: [],
				forms: [],
			},
			{
				type: "signatures",
				value: 0,
				label: "Required Signatures",
				addition_information: "",
				deadlines: [],
				forms: [],
			},
			{
				type: "finance",
				value: "",
				label: "Campaign Finance Report",
				addition_information: "",
				deadlines: [],
				forms: [
					{
						label: "CPF M 102",
						url: "http://files.ocpf.us/pdf/forms/M102_edit.pdf",
					},
				],
			},
			{
				type: "ethics",
				value: "",
				label: "Ethics form? Some kind of disclosure? Is this standard",
				addition_information: "",
				deadlines: [],
				forms: [],
			},
		],
		additional_deadlines: [],
	});

	let [requiresConfirmation, setRequiresConfirmation] = useState(false);
	let [pendingSave, setPendingSave] = useState(false);

	useEffect(() => {
		setElection({
			...election,
			offices: (offices || []).reduce((a, c) => {
				let ending = c.seats.filter((s) => {
					return !!s.terms.find((t) => {
						return t.end_year === +moment().format("YYYY");
					});
				});

				a[c.id] = ending.length;

				return a;
			}, {}),
		});
	}, [offices]);

	const updateSeatCount = (office_id, count) => {
		setElection({
			...election,
			offices: { ...election.offices, [office_id]: count },
		});
	};

	const updateCandidateCount = (office_id, count) => {
		setElection({
			...election,
			peliminary: {
				...election.peliminary,
				offices: {
					...election.peliminary.offices,
					offices,
					[office_id]: count,
				},
			},
		});
	};

	const updatePeliminary = (field, value) => {
		setElection({
			...election,
			peliminary: { ...election.peliminary, [field]: value },
		});
	};

	const update = (field, value) => {
		setElection({ ...election, [field]: value });
	};

	const getDiff = () => {
		return [];
	};

	return (
		<section id="election-form">
			<section className="seats">
				<h3>Seats up for Election</h3>

				<ul className="uk-list election-office-list grid">
					{(offices || []).map((office) => {
						return (
							<li className="width-1-2">
								<input
									type="number"
									min="0"
									max="999"
									step="1"
									value={election.offices[office.id]}
									onChange={(e) => updateSeatCount(office.id, +e.target.value)}
								/>
								<label>{office.title}</label>
							</li>
						);
					})}
				</ul>
			</section>

			<section className="basic">
				<h3>Basic Information</h3>

				<div className="input-wrapper uk-width-1-1">
					<label>Date of Election</label>
					<input
						value={election.election_date}
						type="date"
						onChange={(e) => {
							update("election_date", e.target.value);
						}}
					/>
				</div>

				<div className="input-wrapper uk-width-1-1">
					<label>Election Type</label>
					<select
						className="uk-select"
						value={election.election_type}
						onChange={(e) => {
							update("election_type", e.target.value);
						}}
					>
						<option value="simple_majority">Simple Majority</option>
						<option value="ranked_choice">Ranked Choice</option>
						<option value="multiple_winner">
							Multiple Winner (what's this actually called)
						</option>
					</select>
				</div>
			</section>

			<section className="basic">
				<h3>Peliminary/Primary Election</h3>

				<div className="input-wrapper uk-width-1-1">
					<label>Election Type</label>
					<select
						className="uk-select"
						value={election.peliminary.election_type}
						onChange={(e) => {
							updatePeliminary("election_type", e.target.value);
						}}
					>
						<option value="none">None</option>
						<option value="primary">Primary</option>
						<option value="caucus">Caucus</option>
						<option value="elmination">
							Elimination (what's this actually called)
						</option>
					</select>
				</div>

				{election.peliminary?.election_type !== "none" && (
					<>
						<div className="input-wrapper uk-width-1-1">
							<label>Date of Peliminary Election</label>
							<input
								value={election.peliminary.election_date}
								type="date"
								onChange={(e) => {
									updatePeliminary("election_date", e.target.value);
								}}
							/>
						</div>

						<label>Number of Eventual Candidates</label>
						<ul className="uk-list election-office-list grid">
							{(offices || []).map((office) => {
								return (
									<li className="width-1-2">
										<input
											type="number"
											min="0"
											max="999"
											step="1"
											value={election.peliminary.offices[office.id]}
											onChange={(e) =>
												updateCandidateCount(office.id, +e.target.value)
											}
										/>
										<label>{office.title}</label>
									</li>
								);
							})}
						</ul>
					</>
				)}
			</section>

			<section className="actions">
				<div className={requiresConfirmation ? "" : "hidden"}>
					<p className="error">
						This will permanently delete {getDiff() > 0} seats Are you sure you
						want to proceed?
					</p>
					<div className="btn blocky clicky" onClick={confirm}>
						{pendingSave ? <div data-uk-spinner></div> : <div>Confirm</div>}
					</div>
					<div
						className="btn blocky clicky rev"
						onClick={() => {
							setRequiresConfirmation(false);
						}}
					>
						Cancel
					</div>
				</div>
				<div className={requiresConfirmation ? "hidden" : ""}>
					<div className="btn blocky clicky" onClick={onSave}>
						{pendingSave ? <div data-uk-spinner></div> : <div>Save</div>}
					</div>
					<div className="btn blocky clicky rev" onClick={onCancel}>
						Cancel
					</div>
				</div>
			</section>
		</section>
	);
};
