import { useState, useEffect, useContext } from "react";
import moment from "moment";

import { AppContexts } from "../providers";

export const OnboardingOffices = ({ children }) => {
	const { address, user } = useContext(AppContexts.AuthContext);

	const { offices, getOffices } = useContext(AppContexts.OfficeContext);

	useEffect(() => {
		getOffices(address.city);
	}, []);

	const next = (e) => {};

	const nextElection = (office) => {
		let { seats = [] } = office;
		let terms = seats.reduce((a, c) => {
			return [...a, ...(c.terms || [])];
		}, []);

		let elections = terms.reduce((a, c) => {
			return [...a, ...(c.elections || [])];
		}, []);

		const sortedElections = elections
			.sort(
				(a, b) =>
					new moment(a.polling_date, "YYYY-MM-DD").valueOf() -
					new moment(b.polling_date, "YYYY-MM-DD").valueOf(),
			)
			.filter((e) => {
				let pd = moment(e.polling_date, "YYYY-MM-DD").valueOf();
				let now = moment().valueOf();
				return pd - now > 0;
			});

		return sortedElections[0] || null;
	};

	return (
		<div className="page onboarding offices">
			<div className="form">
				<div className="headline">Here are the offices you can run for.</div>
				<ul className="offices">
					{(offices || []).map((office) => {
						let election = nextElection(office);

						return (
							<li className="office">
								<div className="title">
									<div className="name">{office.title}</div>
									<a
										onClick={() => {
											navigate(`/get-involved/offices/${office.id}`);
										}}
									>
										Learn More →
									</a>
								</div>
								<ul>
									<li className="seats">
										<span>{(office.seats || []).length}</span> Seats
									</li>
									{!!election && (
										<li className="election">
											<span>Next Election on </span>
											<span>
												{moment(election.polling_date).format("MMM DD, YYYY")}
											</span>
										</li>
									)}
								</ul>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="quote">
				<div className="bg">
					<div className="quotation">"</div>
				</div>
				<div className="overlay">
					<p>
						Our children should learn the general framework of their government,
						and then they should know where they come in contact with the
						government, where it touches their daily lives and where their
						influence is exerted on the government. It must not be a distant
						thing, someone else's business, but they must see how every cog in
						the wheel of a democracy is important and bears its share of
						responsibility for the smooth running of the entire machine.
					</p>
					<p className="attribution">Eleanor Roosevelt</p>
				</div>
			</div>
		</div>
	);
};
