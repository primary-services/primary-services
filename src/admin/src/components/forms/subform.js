import { useState, useEffect, useMemo } from "react";

export const SubForm = ({
	form: Form,
	list: List,
	label,
	template,
	items,
	options,
	onSave,
	onEdit,
	onValidate,
}) => {
	const [child, setChild] = useState(null);

	const update = (field, value) => {
		setChild({ ...child, [field]: value });
	};

	// TODO: This is not a good way of managing subforms. Abstract this
	const addChild = () => {
		setChild({ ...template });
	};

	const cancelChild = () => {
		setChild(null);
	};

	const changeChild = (child) => {
		setChild(JSON.parse(JSON.stringify(child)));
	};

	const destoryChild = (childToDestory) => {
		onSave(items.filter((currentChild) => currentChild !== childToDestory));
	};

	const saveChild = () => {
		// TODO: Validate!

		if (child.id === null) {
			onSave([{ ...child }, ...items]);
		} else {
			items.splice(
				items.findIndex((c) => c.id === child.id),
				1,
				{ ...child },
			);

			console.log(items);

			onSave([...items]);
		}

		setChild(null);
	};

	return (
		<section className="subform">
			<div className="section-header">
				<h3>{label}</h3>

				{!child && (
					<span
						className="icon action clickable"
						data-uk-icon="plus"
						onClick={addChild}
					></span>
				)}

				{!!child && [
					<span
						key="confirm"
						className="icon affirm clickable"
						data-uk-icon="check"
						onClick={saveChild}
					></span>,
					<span
						key="cancel"
						className="icon cancel clickable"
						data-uk-icon="close"
						onClick={cancelChild}
					></span>,
				]}
			</div>

			<div className="subform-content">
				{!!child && (
					<Form child={child} setChild={setChild} options={options} />
				)}

				<List items={items} onEdit={editChild} onDestory={destoryChild} />
			</div>
		</section>
	);
};
