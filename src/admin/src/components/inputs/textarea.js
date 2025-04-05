export const TextareaInput = ({ value, rows = 5, label, width, update }) => {
	const className = () => {
		return !!width ? `width-${width[0]}-${width[1]}` : "input-wrapper";
	};

	return (
		<div className={className()}>
			<label>{label}</label>
			<textarea value={value} rows={rows} onInput={update}></textarea>
		</div>
	);
};
