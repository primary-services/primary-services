import moment from "moment";

import { useState, useEffect } from "react";

import { SeatForm } from "./seats.js";
import { SeatList } from "../lists/seats.js";
import { SubForm } from "./subform.js";

export const OfficeForm = ({ editing, onSave, onCancel }) => {
	let [office, setOffice] = useState({
		id: null,
		title: "",
		description: "",
		salary: 0,
		elected: true,
		min_hours: 0,
		max_hours: 0,
		seat_count: 1,
		tenure: 1,
		seats: [],
	});

	useEffect(() => {
		let newSeats = [...(selected.seats || [])].sort((a, b) => {
			let cA = currentTerm(a);
			let cB = currentTerm(b);

			return (cA?.start_year || 0) - (cB?.start_year || 0);
		});

		let newCount = (office.seat_count || 0) - (selected.seat_count || 0);
		for (let i = 0; i < newCount; i++) {
			newSeats.push({
				name: "",
				terms: [
					{
						start: null,
						start_year: +moment().format("YYYY"),
						end: null,
						end_year: +moment().add(office.tenure, "years").format("YYYY"),
						official: {
							first_name: "",
							middle_name: "",
							last_name: "",
						},
					},
				],
			});
		}

		setOffice({ ...office, seats: newSeats });
	}, [office.seat_count]);

	useEffect(() => {
		if (selected) {
			setOffice((prev) => ({ ...prev, ...selected }));
		}
	}, [selected]);

	const currentTerm = (seat) => {
		let currentYear = new Date().getFullYear();

		return (seat.terms || [])
			.filter((t) => {
				return t.start_year <= currentYear && t.end_year >= currentYear;
			})
			.sort((a, b) => {
				return a.start_year - b.start_year;
			})
			.pop();
	};

	useEffect(() => {
		console.log("Office", office);
	}, [office]);

	const update = (field, value) => {
		setOffice({ ...office, [field]: value });
	};

	const updateIncumbent = (term, field, value) => {
		if (!term.official) {
			term.official = {
				name: "",
				first_name: "",
				middle_name: "",
				last_name: "",
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

	const save = async () => {
		let resp = await onSave(office);

		window.UIkit.notification({
			message: `Saved ${office.title} successfully`,
			status: "primary",
			pos: "bottom-left",
			timeout: 5000,
		});

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
				<div className="terms">
					<div className="grid">
						<div className="input-wrapper width-1-2">
							<label>Number of Seats</label>
							<input
								type="number"
								value={+office.seat_count}
								min={+selected.seat_count}
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
					</div>

					<h3>Seats/Terms</h3>
					<ul className="uk-list uk-list-striped">
						{office.seats.map((seat, index) => {
							let term = currentTerm(seat);

							return (
								<li className="term">
									<div className="input-wrapper">
										<label>Incumbent</label>
										<div className="grid">
											<div className="width-1-2">
												<input
													type="text"
													value={term?.official?.first_name || ""}
													placeholder="First Name"
													onInput={(e) => {
														updateIncumbent(term, "first_name", e.target.value);
													}}
												/>
											</div>
											<div className="width-1-2">
												<input
													type="text"
													value={term?.official?.last_name || ""}
													placeHolder="Last Name"
													onInput={(e) => {
														updateIncumbent(term, "last_name", e.target.value);
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
														let year = new Date().getFullYear();
														return (
															<option value={year - idx}>{year - idx}</option>
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
