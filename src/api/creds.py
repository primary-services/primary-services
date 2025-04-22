import os
import boto3
import json

class CredentialsManager:

    def __init__(self):
        self.rdsSecretName = os.environ.get("DBSecret")
        if os.environ.get("PYTHON_ENV") == 'local':
            session = boto3.Session(profile_name='elections')
            self.client = session.client("secretsmanager", region_name="us-east-2")
        if os.environ.get("PYTHON_ENV") == 'local-db':
            pass
        else:
            self.client = boto3.client('secretsmanager')

    def get_creds(self):
        if os.environ.get("PYTHON_ENV") == 'local-db':
            return {
                "host": "127.0.0.1",
                "username": "",
                "password": "",
                "database": "elections"
            }
        else:
            data = self.client.get_secret_value(
                SecretId=self.rdsSecretName
            )
            result = data.get("SecretString")
            return json.loads(result) if result else {}
    
    def get_db_url(self):
        creds = self.get_creds()
        database = creds.get("database")
        username = creds.get("username")
        password = creds.get("password")
        host = creds.get("host")
        port = 5432
        return f"postgresql://{username}:{password}@{host}:{port}/{database}"

