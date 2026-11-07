import json
import time
import urllib.request
import os

from security_guardrails import EnvVault
vault = EnvVault()
API_KEY = vault.get_secret("NVIDIA_NIM_API_KEY")
BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
MODEL = "meta/llama-3.2-11b-vision-instruct"

os.makedirs("C:/Users/ASUS/.gemini/antigravity/scratch/Brewhub/nim_raw", exist_ok=True)

def call_nim(name, prompt, max_tokens=1800):
    print(f"\n[NIM DISPATCH] Calling {MODEL} for {name}...")
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
                "content": "You are an expert React TypeScript frontend architect. Generate high-end, spacious desktop React components using Tailwind CSS and Lucide React. Prioritize wide desktop layouts, elegant spacing, no cramped text, and clean TypeScript interfaces."
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
            print(f"[NIM SUCCESS] {name} in {elapsed:.2f}s ({usage.get('total_tokens', 0)} tokens)")
            with open(f"C:/Users/ASUS/.gemini/antigravity/scratch/Brewhub/nim_raw/{name}.tsx", "w", encoding="utf-8") as f:
                f.write(content)
            return content
    except Exception as e:
        print(f"[NIM ERROR] {name}: {e}")
        return None

if __name__ == "__main__":
    # Task 1: Header Skeleton
    call_nim("Header", """
    Write a React Header component for BrewHub.
    - Brand: Custom SVG coffee bean logo mark + text 'BrewHub'. No 'SPECIALTY ROASTERS' subtitle.
    - Horizontal Nav for desktop with ample spacing (gap-10): 'Origins & Blends' (#origins), 'Brew Guides' (#brew-guides), 'Club Subscription' (#subscription).
    - Right side: Cart Drawer toggle button with counter badge, 'Explore Menu' primary button.
    - Mobile hamburger drawer.
    - Spacious desktop container (max-w-7xl mx-auto px-8 h-20).
    """)

    # Task 2: Order Modality Skeleton
    call_nim("OrderModality", """
    Write a React component for BrewHub Order Modality.
    - Tabs: In-Store Pickup vs Local Courier Delivery.
    - Pickup: 7-day pickup date selection chips, grid of 6 time slots, roastery address card, optional barista notes.
    - Delivery: Full name, phone, address, apartment, city, pin code, delivery window selector (Morning, Afternoon, Evening).
    - Ensure spacious desktop grid layout (max-w-5xl mx-auto, 2-column forms, generous p-8 padding).
    """)