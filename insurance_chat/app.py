# from fastapi import FastAPI, HTTPException, UploadFile, File, Form
# from fastapi.middleware.cors import CORSMiddleware
# from typing import Dict, Any
# from uuid import uuid4
# import base64
# from dotenv import load_dotenv
# load_dotenv()
# from openai import OpenAI
# from services.conversation_service import ConversationService
# from services.transcription_service import TranscriptionService

# client = OpenAI()

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://127.0.0.1:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# SCRIPTS = {
#     "car_lights": "scripts/car_lights.txt",
#     "home_water": "scripts/home_water.txt",
# }

# sessions: Dict[str, Dict[str, Any]] = {}

# transcription_service = TranscriptionService()


# def generate_client_audio(text: str) -> str:
#     response = client.audio.speech.create(
#         model="gpt-4o-mini-tts",
#         voice="alloy",
#         input=text,
#     )

#     audio_bytes = response.read()
#     audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
#     return audio_base64


# @app.get("/")
# def root():
#     return {"message": "Simulator API is running"}


# @app.get("/scripts")
# def get_scripts():
#     return [
#         {"key": "car_lights", "name": "רכב - פנסים"},
#         {"key": "home_water", "name": "דירה - נזקי מים"},
#     ]


# @app.post("/chat/start")
# def start_chat(script_key: str = Form(...)):
#     if script_key not in SCRIPTS:
#         raise HTTPException(status_code=404, detail="Scenario not found")

#     conversation_service = ConversationService(SCRIPTS[script_key])
#     conversation, opening = conversation_service.start_conversation()

#     session_id = str(uuid4())

#     # sessions[session_id] = {
#     #     "script_key": script_key,
#     #     "conversation": conversation,
#     # }
#     sessions[session_id] = {
#     "script_key": script_key,
#     "conversation": conversation,
#     "last_transcript": "",
#     "last_reply": opening,
#     "mode": "auto",
#     }

#     opening_audio_base64 = generate_client_audio(opening)

#     return {
#         "session_id": session_id,
#         "opening_message": opening,
#         "opening_audio_base64": opening_audio_base64,
#         "conversation": conversation,
#     }


# @app.post("/chat/message")
# def send_message(
#     session_id: str = Form(...),
#     message: str = Form(...)
# ):
#     if session_id not in sessions:
#         raise HTTPException(status_code=404, detail="Session not found")

#     session = sessions[session_id]
#     script_key = session["script_key"]
#     conversation = session["conversation"]

#     conversation_service = ConversationService(SCRIPTS[script_key])
#     updated_conversation, reply = conversation_service.send_user_message(
#         conversation,
#         message
#     )

#     sessions[session_id]["conversation"] = updated_conversation

#     audio_base64 = generate_client_audio(reply)

#     return {
#         "reply": reply,
#         "audio_base64": audio_base64,
#         "conversation": updated_conversation,
#     }


# @app.post("/chat/transcribe")
# def transcribe_audio(audio_file: UploadFile = File(...)):
#     text = transcription_service.transcribe_audio(audio_file)
#     return {"text": text}


# # @app.post("/chat/audio-message")
# # def send_audio_message(
# #     session_id: str = Form(...),
# #     audio_file: UploadFile = File(...)
# # ):
# #     if session_id not in sessions:
# #         raise HTTPException(status_code=404, detail="Session not found")

# #     session = sessions[session_id]
# #     script_key = session["script_key"]
# #     conversation = session["conversation"]

# #     user_text = transcription_service.transcribe_audio(audio_file)

# #     conversation_service = ConversationService(SCRIPTS[script_key])
# #     updated_conversation, reply = conversation_service.send_user_message(
# #         conversation,
# #         user_text
# #     )

# #     sessions[session_id]["conversation"] = updated_conversation

# #     audio_base64 = generate_client_audio(reply)

# #     return {
# #         "transcribed_text": user_text,
# #         "reply": reply,
# #         "audio_base64": audio_base64,
# #         "conversation": updated_conversation,
# #     }
# @app.post("/chat/audio-message")
# def send_audio_message(
#     session_id: str = Form(...),
#     audio_file: UploadFile = File(...)
# ):
#     if session_id not in sessions:
#         raise HTTPException(status_code=404, detail="Session not found")

#     session = sessions[session_id]
#     script_key = session["script_key"]
#     conversation = session["conversation"]

#     user_text = transcription_service.transcribe_audio(audio_file).strip()

#     if not user_text:
#         return {
#             "transcribed_text": "",
#             "reply": "",
#             "audio_base64": "",
#             "conversation": conversation,
#             "should_continue_listening": True,
#             "ignored": True,
#         }

#     conversation_service = ConversationService(SCRIPTS[script_key])
#     updated_conversation, reply = conversation_service.send_user_message(
#         conversation,
#         user_text
#     )

#     sessions[session_id]["conversation"] = updated_conversation
#     sessions[session_id]["last_transcript"] = user_text
#     sessions[session_id]["last_reply"] = reply

#     audio_base64 = generate_client_audio(reply)

#     return {
#         "transcribed_text": user_text,
#         "reply": reply,
#         "audio_base64": audio_base64,
#         "conversation": updated_conversation,
#         "should_continue_listening": True,
#         "ignored": False,
#     }
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from uuid import uuid4
import base64
from dotenv import load_dotenv
from openai import OpenAI

from services.conversation_service import ConversationService
from services.transcription_service import TranscriptionService

load_dotenv()

client = OpenAI()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCRIPTS = {
    "car_lights": "scripts/car_lights.txt",
    "home_water": "scripts/home_water.txt",
}

sessions: Dict[str, Dict[str, Any]] = {}

transcription_service = TranscriptionService()


def generate_client_audio(text: str) -> str:
    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",
        input=text,
    )

    audio_bytes = response.read()
    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
    return audio_base64


@app.get("/")
def root():
    return {"message": "Simulator API is running"}


@app.get("/scripts")
def get_scripts():
    return [
        {"key": "car_lights", "name": "רכב - פנסים"},
        {"key": "home_water", "name": "דירה - נזקי מים"},
    ]


@app.post("/chat/start")
def start_chat(script_key: str = Form(...)):
    if script_key not in SCRIPTS:
        raise HTTPException(status_code=404, detail="Scenario not found")

    conversation_service = ConversationService(SCRIPTS[script_key])
    conversation, opening = conversation_service.start_conversation()

    session_id = str(uuid4())

    sessions[session_id] = {
        "script_key": script_key,
        "conversation": conversation,
        "last_transcript": "",
        "last_reply": opening,
        "mode": "auto",
    }

    opening_audio_base64 = generate_client_audio(opening)

    return {
        "session_id": session_id,
        "opening_message": opening,
        "opening_audio_base64": opening_audio_base64,
        "conversation": conversation,
    }


@app.post("/chat/message")
def send_message(
    session_id: str = Form(...),
    message: str = Form(...)
):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    script_key = session["script_key"]
    conversation = session["conversation"]

    trimmed_message = message.strip()
    if not trimmed_message:
        return {
            "reply": "",
            "audio_base64": "",
            "conversation": conversation,
            "ignored": True,
        }

    conversation_service = ConversationService(SCRIPTS[script_key])
    updated_conversation, reply = conversation_service.send_user_message(
        conversation,
        trimmed_message
    )

    sessions[session_id]["conversation"] = updated_conversation
    sessions[session_id]["last_transcript"] = trimmed_message
    sessions[session_id]["last_reply"] = reply

    audio_base64 = generate_client_audio(reply)

    return {
        "reply": reply,
        "audio_base64": audio_base64,
        "conversation": updated_conversation,
        "ignored": False,
    }


@app.post("/chat/transcribe")
def transcribe_audio(audio_file: UploadFile = File(...)):
    text = transcription_service.transcribe_audio(audio_file)
    return {"text": text}


@app.post("/chat/audio-message")
def send_audio_message(
    session_id: str = Form(...),
    audio_file: UploadFile = File(...)
):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    script_key = session["script_key"]
    conversation = session["conversation"]

    user_text = transcription_service.transcribe_audio(audio_file).strip()

    if not user_text:
        return {
            "transcribed_text": "",
            "reply": "",
            "audio_base64": "",
            "conversation": conversation,
            "should_continue_listening": True,
            "ignored": True,
        }

    conversation_service = ConversationService(SCRIPTS[script_key])
    updated_conversation, reply = conversation_service.send_user_message(
        conversation,
        user_text
    )

    sessions[session_id]["conversation"] = updated_conversation
    sessions[session_id]["last_transcript"] = user_text
    sessions[session_id]["last_reply"] = reply

    audio_base64 = generate_client_audio(reply)

    return {
        "transcribed_text": user_text,
        "reply": reply,
        "audio_base64": audio_base64,
        "conversation": updated_conversation,
        "should_continue_listening": True,
        "ignored": False,
    }