import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Load backend/.env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")

print("Looking for .env at:", env_path)
print("Exists:", env_path.exists())

if not api_key:
    print("❌ GEMINI_API_KEY not found.")
    exit()

print("✅ API Key Loaded:", api_key[:8] + "...")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-3.6-flash")
response = model.generate_content("Hello Gemini! Reply in one sentence.")

print("\n🤖 Gemini Response:")
print(response.text)