import { useState, useEffect, useContext } from "react";

import { AppContexts } from "../../providers";

import { TextInput } from "../inputs/text.js";
import { TextareaInput } from "../inputs/textarea.js";
import { SelectInput } from "../inputs/select.js";

import { DeadlineForm } from "./deadlines.js";
import { FormForm } from "./forms.js";

export const RequirementForm = ({
	child: requirement,
	setChild: setRequirement,
}) => {
	const { requirements, forms } = useContext(AppContexts.TownsContext);

	const [selected, setSelected] = useState(null);

	const update = (field, value) => {
		setRequirement({ ...requirement, [field]: value });
	};

	const select = (id) => {
		let r = requirements.find((d) => +d.id === +id);

		if (!!r) {
			setRequirement({ ...r });
		} else {
			setRequirement({ id: null, label: "", description: "", form: null });
		}

		setSelected(id);
	};

	const setDeadline = (deadline) => {
		setRequirement({
			...requirement,
			deadline: deadline,
		});
	};

	const setForm = (form) => {
		setRequirement({
			...requirement,
			form: form,
		});
	};

	return (
		<section id="requirement-form">
			<SelectInput
				value={selected}
				options={[
					{ value: null, label: "None" },
					{ value: "new", label: "New Requirement" },
					...requirements.map((d) => {
						return { value: d.id, label: d.label };
					}),
				]}
				label={"Select a Requirement"}
				update={(e) => {
					select(e.target.value);
				}}
			/>
			{(selected === "new" || requirements.length === 0) && (
				<>
					<div className="input-wrapper grid">
						<TextInput
							value={requirement.label}
							type="text"
							label="Label"
							width={[1, 2]}
							update={(e) => {
								update("label", e.target.value);
							}}
						/>

						<SelectInput
							value={requirement.category}
							options={[
								{ value: "eligability", label: "Eligability" },
								{ value: "reporting", label: "Reporting" },
							]}
							width={[1, 2]}
							label="Category"
							update={(e) => {
								update("category", e.target.value);
							}}
						/>
					</div>
					<TextareaInput
						value={requirement.description}
						label="Description"
						update={(e) => {
							update("description", e.target.value);
						}}
					/>
					<DeadlineForm child={requirement.deadline} setChild={setDeadline} />
					<FormForm child={requirement.form} setChild={setForm} />
				</>
			)}
		</section>
	);
};
