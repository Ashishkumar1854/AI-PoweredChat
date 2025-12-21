

import os

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


def ask_llm(system_prompt: str, user_prompt: str) -> str:
    if LLM_PROVIDER == "gemini":
        return ask_gemini(system_prompt, user_prompt)
    else:
        return fallback_response()


# ---------------- GEMINI ----------------
def ask_gemini(system_prompt: str, user_prompt: str) -> str:
    try:
        import google.generativeai as genai

        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

        # ✅ MODEL LOADED FROM .env 
        model = genai.GenerativeModel(os.getenv("GEMINI_MODEL"))

        prompt = f"""
{system_prompt}

User Question:
{user_prompt}
"""

        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        print("GEMINI ERROR:", e)
        return fallback_response()


# ---------------- FALLBACK ----------------
def fallback_response():
    return (
        "AI service is temporarily unavailable. "
        "You can still ask about tasks (pending / in progress / done)."
    )
