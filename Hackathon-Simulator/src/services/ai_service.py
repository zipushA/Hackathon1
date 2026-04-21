import os
from typing import List, Dict
# from groq import Groq
from openai import OpenAI


class AIService:
    def __init__(self) -> None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("Missing OPENAI_API_KEY in environment variables")

        self.client = OpenAI(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"

    def generate_customer_response(
        self,
        system_prompt: str,
        conversation_history: List[Dict[str, str]],
        agent_message: str,
    ) -> str:
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(conversation_history)
        messages.append({"role": "user", "content": agent_message})

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
        )

        answer = completion.choices[0].message.content.strip()
        if not answer:
            raise ValueError("AI returned empty response")

        return answer