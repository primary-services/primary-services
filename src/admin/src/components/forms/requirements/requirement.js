import { EthicsRequirement } from "./ethics-requirement.js";
import { FinanceRequirement } from "./finance-requirement.js";
import { OtherRequirement } from "./other-requirement.js";
import { ResidencyRequirement } from "./residency-requirement.js";
import { SignatureRequirement } from "./signature-requirement.js";

export const Requirement = ({ requirement, offices, update }) => {
	return (
		<div className="requirement">
			{requirement.type === "ethics" && (
				<EthicsRequirement
					requirement={requirement}
					offices={offices}
					update={update}
				/>
			)}

			{requirement.type === "finance" && (
				<FinanceRequirement
					requirement={requirement}
					offices={offices}
					update={update}
				/>
			)}

			{requirement.type === "other" && (
				<OtherRequirement
					requirement={requirement}
					offices={offices}
					update={update}
				/>
			)}

			{requirement.type === "residency" && (
				<ResidencyRequirement
					requirement={requirement}
					offices={offices}
					update={update}
				/>
			)}

			{requirement.type === "signatures" && (
				<SignatureRequirement
					requirement={requirement}
					offices={offices}
					update={update}
				/>
			)}
		</div>
	);
};
