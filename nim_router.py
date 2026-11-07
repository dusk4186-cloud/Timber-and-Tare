import os
import sys
import json
import time
import urllib.request
from security_guardrails import EnvVault, LeakGuardrail, PromptGuardrail

# Initialize Vault & Security Guardrails
vault = EnvVault()
output_guard = LeakGuardrail(vault)
input_guard = PromptGuardrail()

BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

def query_nim(model: str, prompt: str, max_tokens: int = 2048) -> str:
    """
    Safely dispatches prompt to NVIDIA NIM model with Pre-LLM and Post-LLM security guardrails.
    """
    # 1. Pre-LLM Input Guardrail
    is_safe, sanitized_prompt, violation = input_guard.inspect(prompt)
    if not is_safe:
        print(f"[SECURITY BLOCKED] Prompt rejected: {violation}")
        return None

    api_key = vault.get_secret("NVIDIA_NIM_API_KEY")
    if not api_key:
        print("[NIM ERROR] NVIDIA_NIM_API_KEY not found in secure vault.")
        return None

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are an expert React TypeScript frontend architect. Generate clean, semantic, modern React component code using Tailwind CSS and Lucide React. Return ONLY the TypeScript/React code without markdown triple-backticks."
            },
            {"role": "user", "content": sanitized_prompt}
        ],
        "temperature": 0.2,
        "max_tokens": max_tokens
    }
    req = urllib.request.Request(BASE_URL, data=json.dumps(payload).encode("utf-8"), headers=headers)
    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            duration = time.time() - start
            usage = data.get("usage", {})
            raw_content = data["choices"][0]["message"]["content"]

            # 2. Post-LLM Output Guardrail
            was_clean, clean_content = output_guard.inspect_and_sanitize(raw_content)
            if not was_clean:
                print("[SECURITY ALERT] Sensitive data detected and redacted from NIM model response!")

            print(f"[NIM OK] Model: {model} | Time: {duration:.2f}s | Tokens: {usage.get('total_tokens', '?')}")
            return clean_content
    except Exception as e:
        print("[NIM ERROR]", type(e).__name__)
        return None

if __name__ == "__main__":
    print("Testing NVIDIA NIM Router with Security Guardrails...")
    res = query_nim("meta/llama-3.2-11b-vision-instruct", "Generate a React functional component named CustomBrewHubLogo with a unique geometric SVG coffee bean icon and text BrewHub. Return TSX code only.", max_tokens=500)
    if res:
        print("Response received from NVIDIA NIM successfully!")
        print(res[:300])
