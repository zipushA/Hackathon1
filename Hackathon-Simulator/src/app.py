from fastapi import FastAPI
from src.routes.chat_routes import router as chat_router

app = FastAPI(
    title="Hackathon Simulator API",
    version="1.0.0",
)

app.include_router(chat_router, prefix="/chat", tags=["Chat"])


@app.get("/")
def root():
    return {"message": "Hackathon Simulator API is running"} 