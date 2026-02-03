import os
from openai import OpenAI
from dotenv import load_dotenv

# .env file-la irunthu key-a edukkum
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

try:
    print("🔄 Checking GPT-4o-mini access...")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello, are you GPT-4o-mini? Respond in 1 word."}],
        max_tokens=10
    )
    result = response.choices[0].message.content
    print(f"✅ SUCCESS! Response: {result}")
    print("🚀 Intha key GPT-4o-mini model-ku pakkaa-va work aaguthu m!")
except Exception as e:
    print(f"❌ ERROR: {e}")
    print("⚠️ Check your API key or billing balance in OpenAI dashboard.")