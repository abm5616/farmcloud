import secrets
print(f"SECRET_KEY={secrets.token_urlsafe(50)}")
print(f"DB_PASSWORD={secrets.token_urlsafe(32)}")
