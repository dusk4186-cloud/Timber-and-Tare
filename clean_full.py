import json
with open(r"C:\Users\ASUS\.gemini\antigravity\scratch\Brewhub\original_full_app.tsx", "r", encoding="utf-8") as f:
    raw = f.read()
code = json.loads(raw)
with open(r"C:\Users\ASUS\.gemini\antigravity\scratch\Brewhub\original_clean_app.tsx", "w", encoding="utf-8") as out:
    out.write(code)
print("Saved! Total lines:", len(code.splitlines()))
for i, line in enumerate(code.splitlines()[:60]):
    print(f"{i+1}: {line}")