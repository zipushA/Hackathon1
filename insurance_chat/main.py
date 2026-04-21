# from pathlib import Path
# import os
# from openai import OpenAI

# MODEL = "gpt-5.4"


# def load_prompt(path: str = "prompt.txt") -> str:
#     prompt_path = Path(path)

#     if not prompt_path.exists():
#         raise FileNotFoundError(f"לא נמצא הקובץ: {path}")

#     return prompt_path.read_text(encoding="utf-8").strip()


# def main():
#     api_key = os.getenv("OPENAI_API_KEY")
#     if not api_key:
#         raise RuntimeError("חסר OPENAI_API_KEY במשתני הסביבה")

#     system_prompt = load_prompt("prompt.txt")
#     client = OpenAI(api_key=api_key)

#     conversation = [
#     {
#         "role": "user",
#         "content": "התחל את השיחה"
#     }
# ]

#     print("====================================")
#     print("סימולציית לקוח ביטוח - התחלת שיחה")
#     print("====================================\n")

#     # הודעה ראשונה של הלקוח
#     response = client.responses.create(
#         model=MODEL,
#         instructions=system_prompt,
#         input=conversation,
#     )

#     assistant_text = response.output_text.strip()
#     print(f"לקוח: {assistant_text}\n")

#     conversation.append({
#         "role": "assistant",
#         "content": assistant_text
#     })

#     while True:
#         agent_input = input("נציג: ").strip()

#         if not agent_input:
#             print("לא הוזן טקסט. נסי שוב.\n")
#             continue

#         if agent_input.lower() in ["exit", "quit"]:
#             print("יציאה מהמערכת.")
#             break

#         conversation.append({
#             "role": "user",
#             "content": agent_input
#         })

#         response = client.responses.create(
#             model=MODEL,
#             instructions=system_prompt,
#             input=conversation,
#         )

#         assistant_text = response.output_text.strip()
#         print(f"\nלקוח: {assistant_text}\n")

#         conversation.append({
#             "role": "assistant",
#             "content": assistant_text
#         })


# if __name__ == "__main__":
#     main()




from services.conversation_service import ConversationService
from services.transcription_service import TranscriptionService


SCRIPTS = {
    "1": ("רכב - פנסים", "scripts/car_lights.txt"),
    "2": ("דירה - נזקי מים", "scripts/home_water.txt"),
}

def choose_script():
    print("בחרי תסריט:\n")
    for key, (name, _) in SCRIPTS.items():
        print(f"{key}. {name}")

    while True:
        choice = input("\nהקלידי מספר: ").strip()
        if choice in SCRIPTS:
            return SCRIPTS[choice][1]
        print("בחירה לא תקינה")


def main():
    # conversation_service = ConversationService("prompt.txt")
    script_path = choose_script()
    conversation_service = ConversationService(script_path)
    
    transcription_service = TranscriptionService()

    conversation, opening = conversation_service.start_conversation()

    print("====================================")
    print("סימולציית לקוח ביטוח - התחלת שיחה")
    print("====================================\n")
    print(f"לקוח: {opening}\n")

    while True:
        mode = input("הקלידי T לטקסט, A לאודיו, או exit: ").strip().lower()

        if mode in ["exit", "quit"]:
            print("יציאה מהמערכת.")
            break

        if mode == "t":
            user_text = input("נציג: ").strip()
            if not user_text:
                print("לא הוזן טקסט.\n")
                continue

        elif mode == "a":
            # file_path = input("נתיב לקובץ אודיו: ").strip()
            file_path = input("נתיב לקובץ אודיו: ").strip().strip('"').strip("'")
            try:
                from types import SimpleNamespace
                file_obj = open(file_path, "rb")
                upload_like = SimpleNamespace(
                    filename=file_path.split("\\")[-1],
                    file=file_obj
                )
                user_text = transcription_service.transcribe_audio(upload_like)
                file_obj.close()
                print(f"\nתמלול: {user_text}\n")
            except Exception as e:
                print(f"שגיאה בתמלול: {e}\n")
                continue
        else:
            print("בחירה לא תקינה.\n")
            continue

        try:
            conversation, reply = conversation_service.send_user_message(conversation, user_text)
            print(f"לקוח: {reply}\n")
        except Exception as e:
            print(f"שגיאה ביצירת תגובה: {e}\n")

if __name__ == "__main__":
    main()