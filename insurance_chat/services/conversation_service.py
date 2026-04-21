from pathlib import Path
import os
from openai import OpenAI

MODEL = "gpt-5.4"

class ConversationService:
    def __init__(self, prompt_path: str = "prompt.txt"):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("חסר OPENAI_API_KEY במשתני הסביבה")

        self.client = OpenAI(api_key=api_key)
        self.system_prompt = self._load_prompt(prompt_path)

    def _load_prompt(self, path: str) -> str:
        prompt_path = Path(path)
        if not prompt_path.exists():
            raise FileNotFoundError(f"לא נמצא הקובץ: {path}")
        return prompt_path.read_text(encoding="utf-8").strip()

    def start_conversation(self) -> tuple[list[dict], str]:
        conversation = [
            {"role": "user", "content": "התחל את השיחה"}
        ]

        response = self.client.responses.create(
            model=MODEL,
            instructions=self.system_prompt,
            input=conversation,
        )

        assistant_text = response.output_text.strip()

        conversation.append({
            "role": "assistant",
            "content": assistant_text
        })

        return conversation, assistant_text

    def send_user_message(self, conversation: list[dict], user_text: str) -> tuple[list[dict], str]:
        conversation.append({
            "role": "user",
            "content": user_text
        })

        response = self.client.responses.create(
            model=MODEL,
            instructions=self.system_prompt,
            input=conversation,
        )

        assistant_text = response.output_text.strip()

        conversation.append({
            "role": "assistant",
            "content": assistant_text
        })

        return conversation, assistant_text