import { useState, useEffect, useContext } from "react";

import { AppContexts } from "../../providers";
import { TextInput } from "../inputs/text.js";
import { TextareaInput } from "../inputs/textarea.js";
import { SelectInput } from "../inputs/select.js";

export const DeadlineForm = ({ child: deadline, setChild: setDeadline }) => {
	const { deadlines } = useContext(AppContexts.TownsContext);

	const [selected, setSelected] = useState(null);

	const update = (field, value) => {
		setDeadline({ ...deadline, [field]: value });
	};

	const select = (id) => {
		let s = deadlines.find((d) => +d.id === +id);

		if (!!s) {
			setDeadline({ ...s });
		} else {
			setDeadline({ id: null, label: "", description: "", deadline: null });
		}

		setSelected(id);
	};

	return (
		<section id="deadline-form">
			<SelectInput
				value={selected}
				options={[
					{ value: null, label: "None" },
					{ value: "new", label: "New Deadline" },
					...deadlines.map((d) => {
						return { value: d.id, label: d.label };
					}),
				]}
				label={"Select a Deadline"}
				update={(e) => {
					select(e.target.value);
				}}
			/>
			{(selected === "new" || deadlines.length === 0) && (
				<>
					<div className="input-wrapper grid">
						<TextInput
							value={deadline?.label || ""}
							type="text"
							label="Label"
							width={[1, 2]}
							update={(e) => {
								update("label", e.target.value);
							}}
						/>

						<TextInput
							value={deadline?.deadline || null}
							type="datetime-local"
							label="Label"
							width={[1, 2]}
							update={(e) => {
								update("deadline", e.target.value);
							}}
						/>
					</div>
					<TextareaInput
						value={deadline?.description || ""}
						label="Description"
						update={(e) => {
							update("description", e.target.value);
						}}
					/>
				</>
			)}
		</section>
	);
};
