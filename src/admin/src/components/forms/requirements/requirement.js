import { EthicsRequirement } from "./ethics-requirement.js";
import { FinanceRequirement } from "./finance-requirement.js";
import { OtherRequirement } from "./other-requirement.js";
import { ResidencyRequirement } from "./residency-requirement.js";
import { SignatureRequirement } from "./signature-requirement.js";

export const OtherRequirement = ({ requirement }) => {
	return (
		<div className="requirement">
			{requirement.type === "ethics" && (
				<EthicsRequirement requirement={requirement} />
			)}

			{requirement.type === "finance" && (
				<FinanceRequirement requirement={requirement} />
			)}

			{requirement.type === "other" && (
				<OtherRequirement requirement={requirement} />
			)}

			{requirement.type === "residency" && (
				<ResidencyRequirement requirement={requirement} />
			)}

			{requirement.type === "signature" && (
				<SignatureRequirement requirement={requirement} />
			)}
		</div>
	);
};
