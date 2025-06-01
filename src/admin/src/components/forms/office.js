import moment from "moment";

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
		seat_count: 1,
		tenure: 1,
		seats: [],
	});

	let [terms, setTerms] = useState([]);

	useEffect(() => {
		console.log("New Seat Count:", office.seat_count);
		// let newTerms = [];
		// for (let i = 0; i < office.seat_count; i++) {
		// 	if (!!terms[i]) {
		// 		newTerms.push(terms[i]);
		// 	} else {
		// 		newTerms.push({
		// 			start: moment(),
		// 			end: null,
		// 			incumbent: {
		// 				first_name: "",
		// 				middle_name: "",
		// 				last_name: "",
		// 			},
		// 		});
		// 	}
		// }

		// setTerms(newTerms);
	}, [office.seat_count]);

	useEffect(() => {
		if (selected) {
			setOffice((prev) => ({ ...prev, ...selected }));
		}

		let { seats } = selected;
		let currentYear = +moment().format("YYYY");
		let currentTerms = (seats || []).map((seat) => {
			let current = (seat.terms || [])
				.filter((t) => {
					return t.start_year <= currentYear && t.end_year >= currentYear;
				})
				.sort((a, b) => {
					return a.start_year - b.start_year;
				})
				.pop();

			if (!current) {
				return {
					start: null,
					start_year: currentYear,
					end: null,
					end_year: null,
				};
			} else {
				return current;
			}
		});

		console.log(currentTerms);
		setTerms(currentTerms);
	}, [selected]);

	let [seat, setSeat] = useState(null);
	let [errors, setErrors] = useState({});

	const update = (field, value) => {
		setOffice({ ...office, [field]: value });
	};

	const updateIncumbent = (term, field, value) => {
		term.incumbent[field] = value;
		setTerms([...terms]);
	};

	const updateTerm = (term, field, value) => {
		term[field] = value;
		setTerms([...terms]);
	};

	const saveSeat = (items) => {
		setOffice({
			...office,
			seats: items,
		});
	};

	const validateSeat = () => {};

	const save = async () => {
		console.log("Convert Terms to Seats", terms);

		// let resp = await onSave(office);

		// window.UIkit.notification({
		// 	message: `Saved ${office.title} successfully`,
		// 	status: "primary",
		// 	pos: "bottom-left",
		// 	timeout: 5000,
		// });

		// onCancel();
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
								value={office.seat_count}
								onInput={(e) => {
									update("seat_count", +e.target.value);
								}}
							/>
						</div>

						<div className="input-wrapper width-1-2">
							<label>Term Length (in years)</label>
							<input
								type="number"
								value={office.tenure || 1}
								onInput={(e) => {
									update("tenure", +e.target.value);
								}}
							/>
						</div>
					</div>

					<h2>Terms</h2>
					<ul className="uk-list uk-list-striped">
						{terms.map((term, index) => {
							return (
								<li className="term">
									<div className="input-wrapper">
										<label>Incumbent</label>
										<div className="grid">
											<div className="width-1-2">
												<input
													type="text"
													value={term.incumbent?.first_name || ""}
													placeholder="First Name"
													onInput={(e) => {
														updateIncumbent(term, "first_name", e.target.value);
													}}
												/>
											</div>
											<div className="width-1-2">
												<input
													type="text"
													value={term.incumbent?.last_name || ""}
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
												<input
													type="number"
													value={moment(term.start).format("YYYY")}
													step="1"
													onInput={(e) => {
														updateTerm(term, "start", e.target.value);
													}}
												/>
											</div>
											<div className="width-1-2">
												<label>Term End</label>
												<input
													type="number"
													value={term.end}
													step="1"
													value={moment(term.start)
														.add(office.tenure, "years")
														.format("YYYY")}
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
