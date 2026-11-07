with open(r"C:\Users\ASUS\.gemini\antigravity\scratch\Brewhub\original_app.tsx", "r", encoding="utf-8") as f:
    text = f.read()

import json
try:
    decoded = json.loads(text)
except:
    import ast
    decoded = ast.literal_eval(text)

with open(r"C:\Users\ASUS\.gemini\antigravity\scratch\Brewhub\original_app.tsx", "w", encoding="utf-8") as f:
    f.write(decoded)
print("Unescaped successfully! Total lines:", len(decoded.splitlines()))