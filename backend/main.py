import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Document Summarizer API")

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_enabled = False
gemini_error = "Key not found in environment"

if GEMINI_API_KEY and GEMINI_API_KEY not in ["your_gemini_api_key_here", ""]:
    try:
        print(f"Configuring Gemini with key starting with: {GEMINI_API_KEY[:5]}...")
        genai.configure(api_key=GEMINI_API_KEY)
        
        # List models to see what's available for this key
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        
        if available_models:
            selected_model = "gemini-1.5-flash" # Standard model
            gemini_model = genai.GenerativeModel(selected_model)
            gemini_enabled = True
            gemini_error = None
            print(f"SUCCESS: Gemini API configured with model: {selected_model}")
        else:
            gemini_error = "No supported models found for this key"
            print(gemini_error)
            
    except Exception as e:
        gemini_error = f"Gemini Config Error: {str(e)}"
        print(gemini_error)
        gemini_enabled = False

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Deployment Optimization: Load heavy models ONLY if explicitly requested
load_local = os.getenv("LOAD_LOCAL_MODEL", "false").lower() == "true"
tokenizer = None
model = None

if load_local:
    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        print("Loading Local AI model from cache (facebook/bart-large-cnn)...")
        model_name = "facebook/bart-large-cnn"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        print("SUCCESS: Local Model available as fallback!")
    except Exception as e:
        print(f"Error loading local model: {e}")
else:
    print("SKIP: Local model loading skipped for cloud deployment. Using Gemini only.")

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
    
    # 1. Try Gemini first if enabled
    if gemini_enabled:
        try:
            print("Using Gemini API for summarization...")
            # More flexible prompt that allows user instructions to work
            prompt = f"""You are a professional AI intelligence assistant specialized ONLY in text summarization and analysis. 
            
            Strict Scope Rule:
            - ONLY perform summarization, key topic extraction, or analysis of the provided text.
            - If the user asks for anything else (general chat, unrelated questions, coding, jokes, etc.), you MUST politely refuse and say: "Please provide text data for analysis. I am specialized in summarization only."

            Strict Response Guidelines:
            1. DEFAULT LANGUAGE: Always respond in professional English by default.
            2. EXPLICIT REQUESTS: If and ONLY IF the user explicitly asks for another language (Tamil, Tanglish, etc.), follow that.
            3. FORMATTING: If the user asks for bullet points, topics, or specific lengths, follow them strictly.
            4. METADATA FOOTER: At the very end of your response, always include a clear count of what you delivered (e.g., "Total Points: 5" or "Word Count: 85 words").
            5. QUALITY: Provide a high-quality, concise, and professional result.

            User Input:
            {request.text}
            """
            response = gemini_model.generate_content(prompt)
            summary_text = response.text
            
            return {
                "summary_text": summary_text,
                "original_length": len(request.text),
                "summary_length": len(summary_text),
                "model_used": "Gemini 1.5 Flash"
            }
        except Exception as e:
            print(f"Gemini Error: {e}. Falling back to local model...")

    # 2. Local Model Fallback
    try:
        if 'model' in globals() and 'tokenizer' in globals() and model is not None:
            print("Using manual local inference fallback...")
            inputs = tokenizer([request.text], max_length=1024, return_tensors="pt", truncation=True)
            summary_ids = model.generate(inputs["input_ids"], num_beams=4, max_length=request.max_length, min_length=request.min_length, early_stopping=True)
            summary_text = tokenizer.batch_decode(summary_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]
            
            return {
                "summary_text": summary_text,
                "original_length": len(request.text),
                "summary_length": len(summary_text),
                "model_used": "BART (Local)"
            }
        else:
            return {
                "summary_text": f"AI Engine Error: {gemini_error or 'Unknown error'}. Please check your API key in Render settings.",
                "original_length": len(request.text),
                "summary_length": 0,
                "model_used": "None (Fallback)"
            }
    except Exception as e:
        print(f"Inference Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
