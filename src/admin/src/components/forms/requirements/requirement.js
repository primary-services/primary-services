import { EthicsRequirement } from "./ethics-requirement.js";
import { FinanceRequirement } from "./finance-requirement.js";
import { OtherRequirement } from "./other-requirement.js";
import { ResidencyRequirement } from "./residency-requirement.js";
import { SignatureRequirement } from "./signature-requirement.js";

export const Requirement = ({ requirement, offices }) => {
	return (
		<div className="requirement">
			{requirement.type === "ethics" && (
				<EthicsRequirement requirement={requirement} offices={offices} />
			)}

			{requirement.type === "finance" && (
				<FinanceRequirement requirement={requirement} offices={offices} />
			)}

			{requirement.type === "other" && (
				<OtherRequirement requirement={requirement} offices={offices} />
			)}

			{requirement.type === "residency" && (
				<ResidencyRequirement requirement={requirement} offices={offices} />
			)}

			{requirement.type === "signatures" && (
				<SignatureRequirement requirement={requirement} offices={offices} />
			)}
		</div>
	);
};
