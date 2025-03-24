import os
import boto3
import json


class CredentialsManager:

    def __init__(self):
        self.rdsSecretName = os.environ["DBSecret"]
        self.client = boto3.client("secretsmanager")

    def get_creds(self):
        data = self.client.get_secret_value(
            SecretId=self.rdsSecretName
        )
        result = data.get("SecretString")
        return json.loads(result) if result else {}
    
    def get_db_url(self):
        creds = self.get_creds()
        database = creds.get("database")
        username = creds.get("user")
        password = creds.get("password")
        host = creds.get("host")
        port = 5432
        return f"postgresql://{username}:{password}@{host}:{port}/{database}"

