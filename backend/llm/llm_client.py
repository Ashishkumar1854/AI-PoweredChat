# import os
# from openai import OpenAI

# client = OpenAI(
#     api_key=os.getenv("OPENAI_API_KEY")
# )

# MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# def ask_llm(system_prompt: str, user_prompt: str) -> str:
#     """
#     Central LLM call
#     """
#     response = client.chat.completions.create(
#         model=MODEL,
#         messages=[
#             {"role": "system", "content": system_prompt},
#             {"role": "user", "content": user_prompt}
#         ],
#         temperature=0.3
#     )

#     return response.choices[0].message.content.strip()


import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

def ask_llm(system_prompt: str, user_prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        # 🔥 CRITICAL FALLBACK (NO CRASH)
        print("LLM ERROR:", str(e))
        return (
            "I'm currently unable to use AI intelligence. "
            "Here is the best possible answer based on available data."
        )
