import moment from "moment";

export const TermList = ({ items: terms, onDestory, onEdit }) => {
	return terms.map((t, idx) => {
		return (
			<div className="grid" key={idx}>
				<div className="width-2-12">
					<span
						data-uk-icon="pencil"
						className="icon left-aligned clickable"
						onClick={() => {
							onEdit(t, idx);
						}}
					></span>
					<span
						data-uk-icon="trash"
						className="icon left-aligned clickable"
						onClick={() => {
							onDestory(t);
						}}
					></span>
				</div>
				<div className="width-4-12">{moment(t.start).format("M/D/YY")}</div>
				<div className="width-4-12">{moment(t.end).format("M/D/YY")}</div>
			</div>
		);
	});
};
