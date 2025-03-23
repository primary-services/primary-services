export const TextInput = ({ value, type = "text", label, width, update }) => {
	const className = () => {
		return !!width ? `width-${width[0]}-${width[1]}` : "input-wrapper";
	};

	return (
		<div className={className()}>
			<label>{label}</label>
			<input type={type} value={value} onInput={update} />
		</div>
	);
};
