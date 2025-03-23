import { useState, useEffect, useContext } from "react";

import { AppContexts } from "../../providers";
import { TextInput } from "../inputs/text.js";
import { TextareaInput } from "../inputs/textarea.js";
import { SelectInput } from "../inputs/select.js";

export const FormForm = ({ child: form, setChild: setForm }) => {
	const { forms } = useContext(AppContexts.TownsContext);

	const [selected, setSelected] = useState(null);

	const update = (field, value) => {
		setForm({ ...form, [field]: value });
	};

	const select = (id) => {
		let f = forms.find((s) => +s.id === +id);

		if (!!f) {
			setForm({ ...f });
		} else {
			setForm({ id: null, label: "", description: "", url: "" });
		}

		setSelected(id);
	};

	return (
		<section id="form-form">
			<SelectInput
				value={selected}
				options={[
					{ value: null, label: "None" },
					{ value: "new", label: "New Form" },
					...forms.map((f) => {
						return { value: f.id, label: f.label };
					}),
				]}
				label={"Select a Form"}
				update={(e) => {
					select(e.target.value);
				}}
			/>
			{(selected === "new" || forms.length === 0) && (
				<>
					<div className="input-wrapper grid">
						<TextInput
							value={form?.label || ""}
							type="text"
							label="Label"
							width={[1, 2]}
							update={(e) => {
								update("label", e.target.value);
							}}
						/>

						<TextInput
							value={form?.url || ""}
							type="text"
							label="URL"
							width={[1, 2]}
							update={(e) => {
								update("url", e.target.value);
							}}
						/>
					</div>
					<TextareaInput
						value={form?.description || ""}
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
