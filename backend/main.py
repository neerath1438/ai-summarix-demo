import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Document Summarizer API")

# AI Service Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

openai_client = None
if OPENAI_API_KEY:
    try:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        print("SUCCESS: OpenAI (GPT-4o-mini) configured!")
    except Exception as e:
        print(f"OpenAI Config Error: {e}")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Deployment Optimization: Skip heavy models
load_local = os.getenv("LOAD_LOCAL_MODEL", "false").lower() == "true"
tokenizer = None
model = None

class SummarizeRequest(BaseModel):
    text: str
    max_length: int = 150
    min_length: int = 50

@app.get("/")
def read_root():
    return {"message": "AI Summarizer API is running"}

@app.post("/summarize")
async def summarize_text(request: SummarizeRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    # SYSTEM PROMPT
    prompt = f"""You are a professional AI intelligence assistant specialized ONLY in text summarization and analysis. 
    User Input: {request.text}
    Instructions: Provide a concise summary. Include word count at the end."""

    # 1. Try Gemini fallback (Multi-Key logic with Auto-Model Detection) FIRST for cost savings
    gemini_keys = [k.strip() for k in GEMINI_API_KEY.split(",")] if GEMINI_API_KEY else []
    
    for key in gemini_keys:
        if not key or key in ["your_gemini_api_key_here", "key1"]:
            continue
            
        try:
            print(f"🔄 Attempting Gemini with key: {key[:8]}...")
            genai.configure(api_key=key)
            
            # Auto-detect best model for THIS key
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            
            if not available_models:
                print(f"⚠️ No models available for key {key[:8]}. Skipping...")
                continue
                
            # Priority: 1.5-flash (fastest), then 1.5-pro, then anything else
            selected_model = available_models[0]
            for m in available_models:
                if "gemini-1.5-flash" in m:
                    selected_model = m
                    break
                elif "gemini-1.5-pro" in m:
                    selected_model = m
                    
            print(f"✅ Key {key[:8]} using model: {selected_model}")
            model_engine = genai.GenerativeModel(selected_model)
            response = model_engine.generate_content(prompt)
            
            return {
                "summary_text": response.text,
                "model_used": f"Gemini ({selected_model})"
            }
        except Exception as e:
            print(f"❌ Gemini Key {key[:8]} failed: {e}")
            continue # Try the next key

    # 2. Try OpenAI (GPT-4o-mini) as FINAL FALLBACK if it costs money
    if openai_client:
        try:
            print("Using OpenAI GPT-4o-mini as final fallback...")
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
            summary_text = response.choices[0].message.content
            return {
                "summary_text": summary_text,
                "model_used": "GPT-4o-mini (Fallback)"
            }
        except Exception as e:
            print(f"OpenAI Error: {e}")

    # 3. Final Fallback
    return {
        "summary_text": "AI Engine Error: All Gemini and OpenAI keys failed. Please check your Quota or Keys.",
        "model_used": "None"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
