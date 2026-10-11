with open("js/app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'e.key === "w"' in l or 'e.key === "n"' in l:
        print(f"Line {i+1}: {l.strip()}")
