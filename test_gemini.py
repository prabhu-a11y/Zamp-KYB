import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("VITE_GEMINI_API_KEY")

if not api_key:
    print("❌ VITE_GEMINI_API_KEY not found in environment!")
    exit(1)

print(f"Checking key: {api_key[:5]}...{api_key[-5:]}")

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, can you hear me?")
    print("✅ Success! API Response:")
    print(response.text)
except Exception as e:
    print("❌ API Call Failed:")
    print(e)
