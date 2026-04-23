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