import {
	SecretsManagerClient,
	GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export const getSecret = async (secret_name) => {
	const client = new SecretsManagerClient({
		region: "us-east-2",
	});

	let response;

	try {
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

export const sendEmail = async (to, from, subject, content, options) => {
	const config = {
		Destination: {
			CcAddresses: options?.cc || [],
			ToAddresses: [to, ...(options?.additional_to || [])],
		},
		Message: {
			Body: {
				[options?.html ? "Html" : "Text"]: {
					Charset: "UTF-8",
					Data: content,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: subject,
			},
		},
		Source: from,
		ReplyToAddresses: options?.reply_to || [],
	};

	const sesClient = new SESClient({ region: "us-east-2" });
	const sendCommand = new SendEmailCommand(config);

	return sesClient.send(sendCommand);
};
