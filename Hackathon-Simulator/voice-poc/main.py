import os
import shutil
from fastapi import FastAPI, UploadFile, File
# from groq import Groq
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI()

# יצירת ה-Client של Groq
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.get("/")
def health():
    return {"status": "OpenAI server is running"}


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"

    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        with open(temp_file, "rb") as audio:
            # הפקודה כמעט זהה, רק המודל משתנה לגרסה של Groq
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=(temp_file, audio.read()),  # פורמט קצת שונה לשליחת קובץ
            )

        return {"text": transcription.text}

    except Exception as e:
        return {"error": str(e)}

    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)