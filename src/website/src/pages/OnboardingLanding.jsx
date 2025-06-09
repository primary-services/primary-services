import { useState, useEffect, useContext } from "react";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { useNavigate } from "react-router";

import { AppContexts } from "../providers";

import { formatAddress } from "../utils/utils";

export const OnboardingLanding = ({ children }) => {
	const navigate = useNavigate();

	const { address, setAddress, user, setUser } = useContext(
		AppContexts.AuthContext,
	);

	console.log(user);

	let [userData, setUserData] = useState({ ...user });
	let [errors, setErrors] = useState(null);

	useEffect(() => {
		setUserData({ ...user });
	}, [user]);

	useEffect(() => {
		let autocomplete = document.getElementById("user-location-autocomplete");
		if (autocomplete !== null) {
			const autocompleteInput = new GeocoderAutocomplete(
				autocomplete,
				import.meta.env.VITE_GEOCODER_KEY,
				{
					filter: {
						countrycode: ["us"],
					},
				},
			);

			autocompleteInput.on("select", (location) => {
				console.log(location);
				setAddress(location?.properties);
			});
		}
	}, []);

	useEffect(() => {
		if (errors === null) {
			// Don't validate until next has been called at least once
			return;
		}

		validate();
	}, [userData, address]);

	const update = (field, e) => {
		setUserData({ ...userData, [field]: e.target.value });
	};

	const validate = () => {
		let errs = ["first_name", "last_name", "email"].filter((key) => {
			return !userData[key];
		});

		if (address === null) {
			errs.push("address");
		}

		if (errs.length > 0) {
			setErrors(errs);
			return false;
		}

		setErrors([]);
		return true;
	};

	const next = (e) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		navigate("/get-involved/offices");
	};

	const classes = (...classNames) => {
		return [...classNames].filter((c) => !!c).join(" ");
	};

	// TODO make some form components, that react to errors
	return (
		<div className="page onboarding">
			<div className="form">
				<div className="headline">
					Let’s see what offices you’re qualified to run for.
				</div>
				<form>
					{!!(errors || []).length && (
						<div className="errors">Please fill out all required fields</div>
					)}
					<div
						className={classes(
							"input-wrapper",
							"half",
							"required",
							(errors || []).includes("first_name") ? "error" : "",
						)}
					>
						<label>First Name</label>

						<input
							type="text"
							value={userData.first_name}
							onInput={(e) => {
								update("first_name", e);
							}}
						/>
					</div>

					<div
						className={classes(
							"input-wrapper",
							"half",
							"required",
							(errors || []).includes("last_name") ? "error" : "",
						)}
					>
						<label>Last Name</label>

						<input
							type="text"
							value={userData.last_name}
							onInput={(e) => {
								update("last_name", e);
							}}
						/>
					</div>

					<div
						className={classes(
							"input-wrapper",
							"half",
							"required",
							(errors || []).includes("email") ? "error" : "",
						)}
					>
						<label>Email</label>

						<input
							type="text"
							value={userData.email}
							onInput={(e) => {
								update("email", e);
							}}
						/>
					</div>

					<div className={classes("input-wrapper", "half")}>
						<label>Phone</label>

						<input
							type="text"
							value={userData.phone}
							onInput={(e) => {
								update("first_name", e);
							}}
						/>
					</div>

					<div
						className={classes(
							"input-wrapper",
							"required",
							(errors || []).includes("address") ? "error" : "",
						)}
					>
						{!!address ? (
							<div>
								<div className="address">
									<label>Home Address</label>
									<div className="formatted-address">
										<span>{formatAddress(address)}</span>
										<a onClick={() => setAddress(null)}>
											<svg viewBox="0 0 24 24" height="24">
												<path
													d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
													fill="currentColor"
												></path>
											</svg>
										</a>
									</div>
								</div>
							</div>
						) : null}
						<div className={!!address ? "hidden" : ""}>
							<div className="geoapify-autocomplete-input">
								<label>Home Address</label>
								<div
									id="user-location-autocomplete"
									className="location-autocomplete"
								></div>
							</div>
						</div>
					</div>

					<button className="submit" onClick={next}>
						Next
					</button>
				</form>
			</div>
			<div className="quote">
				<div className="bg">
					<div className="quotation">"</div>
				</div>
				<div className="overlay">
					<p>
						There will never be a true democracy until every responsible and
						law-abiding adult in it, without regard to race, sex, color or creed
						has his or her own inalienable and unpurchasable voice in
						government.
					</p>
					<p className="attribution">Carrie Chapman Catt</p>
				</div>
			</div>
		</div>
	);
};
