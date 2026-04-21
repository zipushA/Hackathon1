import os
import shutil
import tempfile
from fastapi import UploadFile
from openai import OpenAI

class TranscriptionService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("חסר OPENAI_API_KEY במשתני הסביבה")

        self.client = OpenAI(api_key=api_key)

    def transcribe_audio(self, file: UploadFile) -> str:
        suffix = os.path.splitext(file.filename or "audio.wav")[1] or ".wav"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            shutil.copyfileobj(file.file, temp)
            temp_path = temp.name

        try:
            with open(temp_path, "rb") as audio:
                transcript = self.client.audio.transcriptions.create(
                    model="gpt-4o-transcribe",
                    file=audio,
                )
            return transcript.text.strip()
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)