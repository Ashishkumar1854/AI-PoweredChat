# backend/intents/intent_detector.py

from intents.intent_types import IntentType

def detect_intent(question: str) -> IntentType:
    q = question.lower()

    # task status
    if "pending" in q or "completed" in q or "done" in q:
        return IntentType.TASK_STATUS

    # date based
    if "today" in q or "yesterday" in q or "date" in q:
        return IntentType.TASK_DATE

    # task id
    if "task id" in q or "id" in q:
        return IntentType.TASK_ID

    # excel
    if "excel" in q or "formula" in q or "vlookup" in q:
        return IntentType.EXCEL_HELP

    # troubleshooting
    if "not working" in q or "error" in q or "issue" in q:
        return IntentType.TROUBLESHOOT

    return IntentType.GENERAL
