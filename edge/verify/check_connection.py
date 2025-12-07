from google.cloud import secretmanager
import os

project_id = "veiled-vector-core"
secret_id = "akuma-hello-secret"
version_id = "latest"

def access_secret_version(project_id, secret_id, version_id="latest"):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(request={"name": name})
    payload = response.payload.data.decode("UTF-8")
    return payload

if __name__ == "__main__":
    try:
        print(f"Attempting to access secret '{secret_id}' in project '{project_id}'...")
        secret_value = access_secret_version(project_id, secret_id)
        print("Success! Secret value retrieved:")
        print(f"--- {secret_value} ---")
    except Exception as e:
        print(f"Failed to access secret: {e}")
