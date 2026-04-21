import os
import shutil
from fastapi import UploadFile
# from groq import Groq
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


class TranscriptionService:
    def __init__(self) -> None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("Missing OPENAI_API_KEY in .env")

        self.client = OpenAI(api_key=api_key)

    async def transcribe_audio(self, file: UploadFile) -> str:
        temp_file = f"temp_{file.filename}"

        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            with open(temp_file, "rb") as audio:
                transcription = self.client.audio.transcriptions.create(
                    model="whisper-large-v3",
                    file=(temp_file, audio.read()),
                )

            return transcription.text

        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file)