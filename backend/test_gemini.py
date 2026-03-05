"""Quick test of the Gemini API via OpenAI SDK."""
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key="AIzaSyBBtPtmpdi5A5uSgkTfO-_HLKB5CFgOLgo",
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    timeout=30.0,
)

async def test():
    try:
        response = await client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=[
                {"role": "user", "content": "Write 3 professional resume bullet points for a software engineer who built microservices."}
            ],
            max_tokens=512,
            temperature=0.7,
        )
        print("SUCCESS!")
        print(response.choices[0].message.content)
    except Exception as e:
        print(f"ERROR: {type(e).__name__}: {e}")

asyncio.run(test())
