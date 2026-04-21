import os
import json
from typing import List, Dict
# from groq import Groq
from openai import OpenAI


class EvaluationService:
    def __init__(self) -> None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("Missing OPENAI_API_KEY in environment variables")

        self.client = OpenAI(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"

    def evaluate_conversation(self, conversation_history: List[Dict[str, str]]) -> dict:
        evaluation_prompt = """
אתה בוחן שיחת סימולציה של נציג שירות.

נתח את ביצועי הנציג לפי הקריטריונים:
- אדיבות
- הקשבה
- בירור צרכים
- בהירות ההסבר
- סיכום וסגירת שיחה

החזר JSON בלבד במבנה הבא:
{
  "scores": {
    "courtesy": 0,
    "listening": 0,
    "needs_analysis": 0,
    "clarity": 0,
    "closure": 0
  },
  "overall_score": 0,
  "strengths": [],
  "improvements": [],
  "summary": ""
}
        """.strip()

        formatted_history = []
        for msg in conversation_history:
            role = "נציג" if msg["role"] == "user" else "לקוח"
            formatted_history.append(f"{role}: {msg['content']}")

        full_text = "\n".join(formatted_history)

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": evaluation_prompt},
                {"role": "user", "content": full_text},
            ],
            temperature=0.2,
        )

        raw_response = completion.choices[0].message.content.strip()

        try:
            return json.loads(raw_response)
        except json.JSONDecodeError:
            return {
                "scores": {},
                "overall_score": 0,
                "strengths": [],
                "improvements": [],
                "summary": raw_response,
            }