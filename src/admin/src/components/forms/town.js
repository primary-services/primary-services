import { useState, useEffect } from "react";

export const TownForm = ({ town }) => {
	const [data, setData] = useState({});

	useEffect(() => {
		let clerk = town.townClerk || null;
		let assistent = town.assistantTownClerk || null;

		setData({
			name: town.name,
			url: town.url,
			clerk: {
				name: clerk?.name || "",
				email: clerk?.email || clerk?.contactForm || "",
				phone: clerk?.phone || "",
			},
			assistent_clerk: {
				name: assistent?.name || "",
				email: assistent?.email || assistent?.contactForm || "",
				phone: assistent?.phone || "",
			},
			elected_positions: town.electedPositions || [],
		});
	}, [town]);

	const addPosition = () => {
		let { elected_positions } = data;

		elected_positions.push({
			title: "",
			description: "",
			nomination: "",
			incumbent: {
				name: "",
			},
			tenure: 0,
			tenure_unit: "year",
			salary: 0,
			commitment_min: 0,
			commitment_max: 0,
			requirements: [],
			finance_requirements: [],
			forms: [],
		});

		setData({ ...data, elected_positions: elected_positions });
	};

	const addRequirement = (posIdx) => {
		let position = data.elected_positions[posIdx];

		position.requirements.push({
			category: "other",
			description: "",
		});
		setData({ ...data });
	};

	const updateRequirement = (posIdx, reqIdx, field, value) => {
		let position = data.elected_positions[posIdx];
		position.requirements[reqIdx][field] = value;
		setData({ ...data });
	};

	const removeRequirement = (posIdx, reqIdx) => {
		let position = data.elected_positions[posIdx];
		position.requirements.splice(reqIdx, 1);
		setData({ ...data });
	};

	const addFinanceRequirement = (posIdx) => {
		let position = data.elected_positions[posIdx];
		position.finance_requirements.push({
			title: "",
			description: "",
		});
		setData({ ...data });
	};

	const updateFinanceRequirement = (posIdx, reqIdx, field, value) => {
		let position = data.elected_positions[posIdx];
		position.finance_requirements[reqIdx][field] = value;
		setData({ ...data });
	};

	const removeFinanceRequirement = (posIdx, reqIdx) => {
		let position = data.elected_positions[posIdx];
		position.finance_requirements.splice(reqIdx, 1);
		setData({ ...data });
	};

	const addForm = (posIdx) => {
		let position = data.elected_positions[posIdx];
		position.forms.push({
			title: "",
			description: "",
			url: "",
		});
		setData({ ...data });
	};

	const updateForm = (posIdx, formIdx, field, value) => {
		let positions = data.elected_positions[posIdx];
		positions.forms[formIdx][field] = value;
		setData({ ...data });
	};

	const removeForm = (posIdx, formIdx) => {
		let positions = data.elected_positions[posIdx];
		positions.forms.splice(formIdx, 1);
		setData({ ...data });
	};

	const isEmail = (str) => {
		let emailRegEx =
			/((?:(?:[^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))/gi;

		return emailRegEx.test(str);
	};

	const buildEmail = (email) => {
		if (!email) return <a>Unknown Email</a>;

		if (isEmail(email)) {
			return <a href={`mailto:${email}`}>{email}</a>;
		} else {
			return (
				<a href={email} target="_blank">
					Contact Form
				</a>
			);
		}
	};

	const buildPhone = (phone) => {
		if (!phone) return <a>Unknown Phone</a>;

		return <a href={`tel:${phone}`}>{phone}</a>;
	};

	const update = (posIdx, field, value) => {
		data.elected_positions[posIdx][field] = value;

		setData({ ...data });
	};

	return (
		<form>
			<section className="basic-info">
				<h2>
					<a href={town?.url} target="_blank">
						{data?.name}
					</a>
				</h2>

				<div>
					<div>
						<b>Town Clerk: {data?.clerk?.name || "Unknown"}</b>
					</div>
					<div>
						{buildEmail(data.clerk?.email)} {buildPhone(data?.clerk?.phone)}
					</div>
				</div>
			</section>

			<div className="btn blocky" onClick={addPosition}>
				Add Elected Position
			</div>
			<section className="positions block">
				<h3>Basic Info</h3>
				{(data?.elected_positions || []).map((pos, idx) => {
					return (
						<div className="position block" key={`position-${idx}`}>
							<div>
								<div className="input-wrapper uk-width-3-5">
									<div className="uk-width-3-5">
										<label>Title</label>
										<input
											type="text"
											value={pos.title}
											onInput={(e) => {
												update(idx, "title", e.target.value);
											}}
										/>
									</div>
									<div className="uk-width-1-5">
										<label>Tenure</label>
										<input
											type="number"
											value={pos.tenure}
											onInput={(e) => {
												update(idx, "tenure", e.target.value);
											}}
										/>
									</div>
									<div className="uk-width-1-5">
										<label>Tenure Unit</label>
										<select
											value={pos.tenure_unit}
											onInput={(e) => {
												update(idx, "tenure_unit", e.target.value);
											}}
										>
											<option value="year">Years</option>
											<option value="month">Months</option>
										</select>
									</div>
								</div>
								<div className="input-wrapper uk-width-2-5">
									<div className="uk-width-1-2">
										<label>Salary</label>
										<input
											type="number"
											value={pos.salary}
											onInput={(e) => {
												update(idx, "tenure", e.target.value);
											}}
										/>
									</div>

									<div className="uk-width-1-4">
										<label>Min Hours</label>
										<input
											type="number"
											value={pos.salary}
											onInput={(e) => {
												update(idx, "tenure", e.target.value);
											}}
										/>
									</div>

									<div className="uk-width-1-4">
										<label>Max Hours</label>
										<input
											type="number"
											value={40}
											onInput={(e) => {
												update(idx, "tenure", e.target.value);
											}}
										/>
									</div>
								</div>
							</div>

							<div className="input-wrapper uk-width-1-1">
								<label>Description</label>
								<textarea
									value={pos.description}
									rows="5"
									onInput={(e) => {
										update(idx, "description", e.target.value);
									}}
								></textarea>
							</div>

							<div className="input-wrapper uk-width-1-1">
								<label>How to get on the ballot</label>
								<textarea
									value={pos.nomination}
									rows="5"
									onInput={(e) => {
										update(idx, "nomination", e.target.value);
									}}
								></textarea>
							</div>

							<div className="requirements block">
								<h3>Requirements</h3>
								<ul className="uk-list">
									{pos.requirements.map((req, reqIdx) => {
										return (
											<li className="uk-width-1-1" key={`requirement-${idx}`}>
												<div className="input-wrapper uk-width-1-1">
													<label>Requirment Category</label>
													<select
														type="text"
														value={req.category}
														onInput={(e) => {
															updateRequirement(
																idx,
																reqIdx,
																"category",
																e.target.value,
															);
														}}
													>
														<option value="age">Age</option>
														<option value="residency">Residency</option>
														<option value="other">Other</option>
													</select>
												</div>
												<div className="input-wrapper uk-width-1-1">
													<label>Requirment Details</label>
													<textarea
														value={pos.description}
														rows="5"
														onInput={(e) => {
															updateRequirement(
																idx,
																reqIdx,
																"description",
																e.target.value,
															);
														}}
													></textarea>
												</div>
											</li>
										);
									})}
								</ul>
								<div className="btn blocky" onClick={() => addRequirement(idx)}>
									Add Requirement
								</div>
							</div>

							<div className="finance_requirements block">
								<h3>Financial Requirements</h3>
								<ul className="finance_requirements uk-list">
									{pos.finance_requirements.map((req, reqIdx) => {
										return (
											<li
												className="uk-width-1-1"
												key={`financial-requirement-${idx}`}
											>
												<div className="input-wrapper uk-width-1-1">
													<label>Title</label>
													<input
														type="text"
														value={pos.title}
														onInput={(e) => {
															updateFinanceRequirement(
																idx,
																reqIdx,
																"title",
																e.target.value,
															);
														}}
													/>
												</div>
												<div className="input-wrapper uk-width-1-1">
													<label>Requirment Details</label>
													<textarea
														value={pos.description}
														rows="5"
														onInput={(e) => {
															updateFinanceRequirement(
																idx,
																reqIdx,
																"description",
																e.target.value,
															);
														}}
													></textarea>
												</div>
											</li>
										);
									})}
								</ul>

								<div
									className="btn blocky"
									onClick={() => addFinanceRequirement(idx)}
								>
									Add Financial Requirements
								</div>
							</div>

							<div className="forms block">
								<h3>Forms</h3>
								<ul className="uk-list">
									{pos.forms.map((form, formIdx) => {
										return (
											<li
												className="input-wrapper uk-width-1-1"
												key={`forms-${idx}`}
											>
												<div className="uk-width-1-1">
													<label>Title</label>
													<input
														type="text"
														value={form.title}
														onInput={(e) => {
															updateForm(idx, formIdx, "title", e.target.value);
														}}
													/>
												</div>
												<div className="input-wrapper uk-width-1-1">
													<label>Description</label>
													<textarea
														value={form.description}
														rows="5"
														onInput={(e) => {
															updateForm(
																idx,
																formIdx,
																"description",
																e.target.value,
															);
														}}
													></textarea>
												</div>
												<div className="input-wrapper uk-width-1-1">
													<label>URL</label>
													<input
														type="text"
														value={form.title}
														onInput={(e) => {
															updateForm(idx, formIdx, "url", e.target.value);
														}}
													/>
												</div>
											</li>
										);
									})}
								</ul>

								<div className="btn blocky" onClick={() => addForm(idx)}>
									Add Forms
								</div>
							</div>
						</div>
					);
				})}
			</section>
		</form>
	);
};
