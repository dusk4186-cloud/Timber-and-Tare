import json
import time
import urllib.request
import os

API_KEY = "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"
BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "meta/llama-3.2-11b-vision-instruct"

def call_nim(prompt, max_tokens=1500):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a senior UI/UX engineer and React TypeScript developer. You write clean, elegant, desktop-friendly React code using Tailwind CSS and Lucide React. Return clean TSX code."
            },
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": max_tokens
    }
    req = urllib.request.Request(BASE_URL, data=json.dumps(payload).encode("utf-8"), headers=headers)
    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            elapsed = time.time() - start
            usage = data.get("usage", {})
            content = data["choices"][0]["message"]["content"]
            print(f"[NIM SUCCESS] {MODEL} | {elapsed:.2f}s | {usage.get('total_tokens', 0)} tokens")
            return content
    except Exception as e:
        print(f"[NIM ERROR] {e}")
        return None

if __name__ == "__main__":
    print(f"=== Querying NVIDIA NIM: {MODEL} ===")
    
    # 1. Custom Brand Logo
    prompt_logo = """
    Write a React component named CustomLogo with a bespoke inline SVG for BrewHub.
    The icon should be a modern, minimalist artisan coffee bean fused with an extraction droplet.
    Color: amber-400 / amber-500 (#f59e0b). 
    It renders the SVG icon alongside the brand text 'BrewHub' in bold tracking-tight white text.
    NO subtitle like 'SPECIALTY ROASTERS'. Just the clean mark and 'BrewHub'.
    """
    logo_code = call_nim(prompt_logo, max_tokens=800)
    with open("C:/Users/ASUS/.gemini/antigravity/scratch/Brewhub/src/components/CustomLogo.tsx", "w", encoding="utf-8") as f:
        f.write(logo_code if logo_code else "// fallback")
    print("Saved CustomLogo.tsx from NVIDIA NIM")