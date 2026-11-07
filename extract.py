import json
with open(r"C:\Users\ASUS\.gemini\antigravity-ide\brain\18b82818-7b4e-44ac-8954-f2a0f3360ca2\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        if obj.get("step_index") == 207:
            for tc in obj.get("tool_calls", []):
                raw = tc.get("args", {}).get("CodeContent", "")
                with open(r"C:\Users\ASUS\.gemini\antigravity\scratch\Brewhub\original_app.tsx", "w", encoding="utf-8") as out:
                    out.write(raw)
                print("Success! Saved original_app.tsx")