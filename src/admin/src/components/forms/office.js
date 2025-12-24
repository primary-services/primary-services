import moment from "moment";

import { useState, useEffect, useMemo } from "react";

import { SeatForm } from "./seats.js";
import { SeatList } from "../lists/seats.js";
import { SubForm } from "./subform.js";

import { arr, showNotification } from "../../utils.js";

export const OfficeForm = ({ selected, onSave, onCancel }) => {
	let [office, setOffice] = useState({
		id: null,
		title: "",
		description: "",
		salary: 0,
		elected: true,
		min_hours: 0,
		max_hours: 0,
		seat_count: 0,
		tenure: 1,
		seats: [],
		shared: false,
	});

	let [requiresConfirmation, setRequiresConfirmation] = useState(false);
	let [pendingSave, setPendingSave] = useState(false);

	// If less than 30 days until new year, consider it next year
	const currentYear = useMemo(() => +moment().add(30, "days").format("YYYY"), []);

	useEffect(() => {
		let sorted = [...arr(selected.seats)].sort((a, b) => {
			let cA = currentTerm(a);
			let cB = currentTerm(b);

			return (cA?.start_year || 0) - (cB?.start_year || 0);
		});

		let newSeats = new Array(office.seat_count).fill(null).map((_, idx) => {
			if (idx < sorted.length) {
				return JSON.parse(JSON.stringify(sorted[idx]));
			} else {
				return {
					name: "",
					terms: [
						{
							start: null,
							start_year: currentYear,
							end: null,
							end_year: currentYear + office.tenure,
							official: {
								name: "",
							},
						},
					],
				};
			}
		});

		setOffice({ ...office, seats: newSeats });
	}, [office.seat_count]);

	useEffect(() => {
		if (selected) {
			setOffice((prev) => ({ ...prev, ...selected }));
		}
	}, [selected]);

	const currentTerm = (seat) => {
		return (seat.terms || [])
			.filter((t) => {
				return t.start_year <= currentYear && t.end_year >= currentYear;
			})
			.sort((a, b) => {
				return a.start_year - b.start_year;
			})
			.pop();
	};

	const update = (field, value) => {
		// value = value.replace(/(?<!\.|\?)([\r|\n])+([^?\.]+)/gm, "");
		setOffice({ ...office, [field]: value });
	};

	const format = (field, e) => {
		e.preventDefault();

		let value = (e.clipboardData || window.clipboardData).getData("text");
		let formatted = value.replace(/(?<!\.|\?|\n)([\r|\n])+([^?\.]+)/gm, "");

		setOffice({ ...office, [field]: formatted });
	};

	const updateIncumbent = (term, field, value) => {
		if (!term.official) {
			term.official = {
				name: "",
			};
		}
		term.official[field] = value;
		setOffice({ ...office, seats: [...office.seats] });
	};

	const updateTerm = (term, field, value) => {
		term[field] = value;
		setOffice({ ...office, seats: [...office.seats] });
	};

	// const saveSeat = (items) => {
	// 	setOffice({
	// 		...office,
	// 		seats: items,
	// 	});
	// };

	const validateSeat = () => {};

	const getDiff = () => {
		return arr(selected.seats).length - arr(office.seats).length;
	};

	const save = async () => {
		if (getDiff() > 0) {
			return setRequiresConfirmation(true);
		}

		return confirm();
	};

	const confirm = async () => {
		if (pendingSave) {
			return;
		}

		setPendingSave(true);
		let resp = await onSave(office);
		setPendingSave(false);

		if (!resp.error_code) {
			showNotification({
				message: `Saved office successfully`,
			});
		} else {
			showNotification({
				message: resp.error_msg,
				status: "danger",
			});
		}

		setRequiresConfirmation(false);
		onCancel();
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
				{/*
				<div className="input-wrapper uk-width-1-1">
					<label>Description</label>
					<textarea
						value={office.description}
						rows="5"
						onInput={(e) => {
							update("description", e.target.value);
						}}
						onPaste={(e) => {
							format("description", e);
						}}
					></textarea>
				</div>
				*/}
				{/*
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
				*/}
			</section>

			{office.elected && (
				<div className="terms">
					<div className="grid">
						<div className="input-wrapper width-1-2">
							<label>Number of Seats</label>
							<input
								type="number"
								value={+office.seat_count}
								min="0"
								step="1"
								onInput={(e) => {
									update("seat_count", +e.target.value);
								}}
							/>
						</div>

						<div className="input-wrapper width-1-2">
							<label>Term Length (in years)</label>
							<input
								type="number"
								value={+office.tenure || 1}
								min="1"
								step="1"
								onInput={(e) => {
									update("tenure", +e.target.value);
								}}
							/>
						</div>

						<div className="width-1-1">
							<input
								id="shared"
								name="shared"
								type="checkbox"
								key={`shared-${!!office.shared}`}
								checked={!!office.shared}
								onChange={(ev) => {
									update("shared", ev.target.checked);
								}}
							/>
							<label htmlFor="shared">
								{" "}
								Office is shared across municipalities (e.g. regional school
								board position)
							</label>
						</div>
					</div>

					<h3>Seats/Terms</h3>
					<ul className="uk-list uk-list-striped">
						{office.seats.map((seat, index) => {
							let term = currentTerm(seat) || seat.terms[0];

							return (
								<li className="term">
									<div className="input-wrapper">
										<label>Incumbent</label>
										<div className="grid">
											<div className="width-1-1">
												<input
													type="text"
													value={term?.official?.name || ""}
													placeholder="Name"
													onInput={(e) => {
														updateIncumbent(term, "name", e.target.value);
													}}
												/>
											</div>
										</div>
									</div>

									<div className="input-wrapper term-year">
										<div className="grid">
											<div className="width-1-2">
												<label>Term Start</label>
												<select
													value={+term.start_year}
													onInput={(e) => {
														updateTerm(term, "start_year", e.target.value);
													}}
												>
													{new Array(10).fill(null).map((_, idx) => {
														return (
															<option value={currentYear - idx}>{currentYear - idx}</option>
														);
													})}
												</select>
											</div>
											<div className="width-1-2">
												<label>Term End</label>
												<input
													type="number"
													step="1"
													value={+term?.start_year + +office.tenure}
													disabled={true}
												/>
											</div>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			)}

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
					<div className="btn blocky clicky" onClick={save}>
						{pendingSave ? <div data-uk-spinner></div> : <div>Save</div>}
					</div>
					<div className="btn blocky clicky rev" onClick={cancel}>
						Cancel
					</div>
				</div>
			</section>
		</section>
	);
};
