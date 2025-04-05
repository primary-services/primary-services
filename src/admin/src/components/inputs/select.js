export const SelectInput = ({ value, options = [], label, width, update }) => {
	const className = () => {
		return !!width ? `width-${width[0]}-${width[1]}` : "input-wrapper";
	};

	return (
		<div className={className()}>
			<label>{label}</label>
			<select value={value} onInput={update}>
				{options.map((o) => {
					return <option value={o.value}>{o.label}</option>;
				})}
			</select>
		</div>
	);
};
