import asyncio
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from litellm import completion
import os
from dotenv import load_dotenv

# env
load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
if openai_api_key:
    print(f"OpenAI API Key exists and begins {openai_api_key[:8]}")
else:
    print("OpenAI API Key not set")

if deepseek_api_key:
    print(f"DeepSeek API Key exists and begins {deepseek_api_key[:8]}")
else:
    print("DeepSeek API Key not set")

app = FastAPI()

system_prompt = '''
You are a helpful assistant
'''
# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# BaseModel rules:
class Message(BaseModel):
    sys_prompt: str
    user_prompt: str
    enable: Dict[str, bool]

async def openaiResponse(model: str, user_prompt: str):
    response = await asyncio.to_thread(
        completion,
        model=f"openai/{model}",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
    )
    print("processing openai")
    return {
        "reply": response.choices[0].message.content,
        "cost": response._hidden_params["response_cost"] * 100
    }


async def deepseekResponse(model: str, user_prompt: str):
    response = await asyncio.to_thread(
        completion,
        model=f"deepseek/deepseek-{model}",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
    )
    print("processing deepseek")
    return {
        "reply": response.choices[0].message.content,
        "cost": response._hidden_params["response_cost"] * 100
    }
            

@app.post("/chat")
async def chat(message: Message):
    response = {}
    global system_prompt
    system_prompt = message.sys_prompt
    user_prompt = message.user_prompt
    print("Received enable:", message.enable)
    print("User prompt:", message.user_prompt)
    try:
        if message.enable.get("OpenAI-4-mini"):
            print("enable openai-4-mini")
            response["OpenAI-4-mini"] = openaiResponse("gpt-4.1-mini", user_prompt)
        if message.enable.get("Deepseek-chat"):
            print("enable ds chat")
            response["Deepseek-chat"] = deepseekResponse("chat", user_prompt)
        if message.enable.get("Deepseek-reasoner"):
            print("enable ds reasoner")
            response["Deepseek-reasoner"] = deepseekResponse("reasoner", user_prompt)
        # create an object, not start yet

        # {
        # "openai_4_mini": <coroutine openaiResponse(...)>,
        # "deepseek": <coroutine deepseekResponse(...)>
        # }
        
        results = await asyncio.gather(*response.values())
        # gather: start together, wait until finish
        # asyncio.gather(coro1, coro2, coro3, ...)
        # * to expand the expression
        print(results)
        return dict(zip(response.keys(), results))
        # zip object: [1, 2, 3], [a, b, c] => [(1, a), (2, b), (3, c)]
        # transfer it to a dictionary
    
    except Exception as e:
        print("Chat error:", e)
        return {"error": str(e)}
