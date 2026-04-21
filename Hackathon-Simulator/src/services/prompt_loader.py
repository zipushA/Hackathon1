from pathlib import Path


PROMPT_FILE = Path(__file__).resolve().parent.parent / "server" / "prompts" / "prompt.txt"


def load_prompt() -> str:
    if not PROMPT_FILE.exists():
        raise FileNotFoundError(f"Prompt file not found: {PROMPT_FILE}")

    return PROMPT_FILE.read_text(encoding="utf-8").strip()