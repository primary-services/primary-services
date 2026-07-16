export const OfficePicker = ({ requirement, offices, toggle }) => {
	return (
		<ul className="uk-list election-office-list grid">
			{(offices || []).map((office) => {
				let isChecked = requirement.offices.find((o) => o === office.id);

				return (
					<li className="width-1-2">
						<input
							type="checkbox"
							checked={isChecked}
							value={office.id}
							onChange={(e) => toggle(office.id)}
						/>
						<label>{office.title}</label>
					</li>
				);
			})}
		</ul>
	);
};
