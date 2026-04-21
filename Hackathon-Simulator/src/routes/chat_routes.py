from typing import Dict, List
from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from src.services.prompt_loader import load_prompt
from src.services.ai_service import AIService
from src.services.evaluation_service import EvaluationService
from src.services.transcription_service import TranscriptionService


router = APIRouter()

ai_service = AIService()
evaluation_service = EvaluationService()
transcription_service = TranscriptionService()

# זיכרון זמני בלבד ל-MVP
conversation_store: Dict[str, List[Dict[str, str]]] = {}


@router.post("/start")
def start_conversation(session_id: str = Form(...)):
    if session_id in conversation_store:
        return {
            "message": "Session already exists",
            "session_id": session_id,
            "history": conversation_store[session_id],
        }

    prompt = load_prompt()
    opening_message = ai_service.generate_customer_response(
        system_prompt=prompt,
        conversation_history=[],
        agent_message="התחל את השיחה עכשיו.",
    )

    conversation_store[session_id] = [
        {"role": "assistant", "content": opening_message}
    ]

    return {
        "session_id": session_id,
        "customer_message": opening_message,
        "history": conversation_store[session_id],
    }


@router.post("/message")
async def send_message(
    session_id: str = Form(...),
    audio_file: UploadFile = File(...),
):
    if session_id not in conversation_store:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        transcript = await transcription_service.transcribe_audio(audio_file)
        prompt = load_prompt()
        history = conversation_store[session_id]

        customer_reply = ai_service.generate_customer_response(
            system_prompt=prompt,
            conversation_history=history,
            agent_message=transcript,
        )

        history.append({"role": "user", "content": transcript})
        history.append({"role": "assistant", "content": customer_reply})

        return {
            "session_id": session_id,
            "agent_transcript": transcript,
            "customer_reply": customer_reply,
            "history": history,
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/evaluate")
def evaluate_session(session_id: str = Form(...)):
    if session_id not in conversation_store:
        raise HTTPException(status_code=404, detail="Session not found")

    history = conversation_store[session_id]
    result = evaluation_service.evaluate_conversation(history)

    return {
        "session_id": session_id,
        "evaluation": result,
    }