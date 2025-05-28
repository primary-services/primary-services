import { useState, useEffect, useContext } from "react";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { useNavigate } from "react-router";

import { AppContexts } from "../../providers";

import { formatAddress } from "../../utils/utils";

export const Header = ({ children }) => {
	const navigate = useNavigate();
	const { address, setAddress } = useContext(AppContexts.AuthContext);

	// Set up the address input w/ autocomplete
	useEffect(() => {
		let autocomplete = document.getElementById("location-autocomplete");
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
				setAddress(location?.properties);
			});
		}
	}, []);

	return (
		<header className="main-header">
			<div className="main-header-wrapper">
				<div className="header-left">
					<a onClick={() => navigate("/")}>Democracy Hub</a>
				</div>
				<div className="header-right">
					{!!address ? (
						<div>
							<div className="address">
								<label>Home Address</label>
								<div>{formatAddress(address)}</div>
							</div>
							<div className="sub">
								<a onClick={() => setAddress(null)}>Change</a>
							</div>
						</div>
					) : null}
					<div className={!!address ? "hidden" : ""}>
						<div className="geoapify-autocomplete-input">
							<label>Home Address</label>
							<div
								id="location-autocomplete"
								className="location-autocomplete"
							></div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
