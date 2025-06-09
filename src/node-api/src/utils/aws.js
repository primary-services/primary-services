import {
	SecretsManagerClient,
	GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export const getSecret = async (secret_name) => {
	const client = new SecretsManagerClient({
		region: "us-east-2",
	});

	let response;

	try {
		console.log("Trying AWS Generated Code:", secret_name);
		response = await client.send(
			new GetSecretValueCommand({
				SecretId: secret_name,
				VersionStage: "AWSCURRENT",
			}),
		);
	} catch (error) {
		throw error;
	}

	const secret = JSON.parse(response.SecretString);

	return [secret, null];
};
