from dotenv import load_dotenv
import os

load_dotenv("backend/.env")

print("Database URL:")
print(os.getenv("DATABASE_URL"))