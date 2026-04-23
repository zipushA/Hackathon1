from pathlib import Path
import os
from openai import OpenAI
import json

MODEL = "gpt-5.4"

# def try_parse_feedback(text: str):
#     text = (text or "").strip()

#     if not text:
#         return False, None

#     if not text.startswith("{"):
#         return False, None

#     try:
#         parsed = json.loads(text)
#     except Exception:
#         return False, None

#     if isinstance(parsed, dict) and (
#         "AGENT" in parsed or
#         "LISTEN" in parsed or
#         "feedback" in parsed or
#         "score" in parsed
#     ):
#         return True, parsed

#     return False, None
def try_parse_feedback(text: str):
    text = (text or "").strip()

    if not text:
        return False, None

    # מנקה בלוקי קוד כמו ```json ... ```
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1 or end <= start:
        return False, None

    possible_json = text[start:end + 1]

    try:
        parsed = json.loads(possible_json)
    except Exception:
        return False, None

    if isinstance(parsed, dict) and (
        "AGENT" in parsed or
        "LISTEN" in parsed or
        "feedback" in parsed or
        "score" in parsed
    ):
        return True, parsed

    return False, None

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

    # def send_user_message(self, conversation: list[dict], user_text: str) -> tuple[list[dict], str]:
    #     conversation.append({
    #         "role": "user",
    #         "content": user_text
    #     })

    #     response = self.client.responses.create(
    #         model=MODEL,
    #         instructions=self.system_prompt,
    #         input=conversation,
    #     )

    #     assistant_text = response.output_text.strip()

    #     conversation.append({
    #         "role": "assistant",
    #         "content": assistant_text
    #     })

    #     return conversation, assistant_text

    def send_user_message(self, conversation: list[dict], user_text: str) -> tuple[list[dict], str, bool, dict | None]:
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

        is_feedback, feedback_data = try_parse_feedback(assistant_text)

        if is_feedback:
            return conversation, "", True, feedback_data

        conversation.append({
            "role": "assistant",
            "content": assistant_text
        })

        return conversation, assistant_text, False, None