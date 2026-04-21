import os
from pathlib import Path
from dotenv import load_dotenv
# from groq import Groq
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

prompt_path = Path(__file__).resolve().parent / "prompts" / "prompt.txt"
prompt = prompt_path.read_text(encoding="utf-8")

messages = [
    {"role": "system", "content": prompt}
]

print("Simulation started. Type 'exit' to stop.\n")

while True:
    user_input = input("Agent: ").strip()

    if user_input.lower() == "exit":
        break

    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7,
    )

    reply = response.choices[0].message.content.strip()

    print(f"\nCustomer: {reply}\n")

    messages.append({"role": "assistant", "content": reply})