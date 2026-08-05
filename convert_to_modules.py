import os
import re

ts_dir = "src/ts"
files = [f for f in os.listdir(ts_dir) if f.endswith(".ts")]

# Map file names to module names
modules = {
    "app.ts": "App",
    "assessment.ts": "Assessment",
    "auth.ts": "Auth",
    "bluetooth.ts": "Bluetooth",
    "charts.ts": "Charts",
    "kicks.ts": "Kicks",
    "scoring.ts": "Scoring",
    "store.ts": "Store",
    "ui.ts": "UI",
    "vitals.ts": "Vitals"
}

# The imports each file needs (rough guess, we can just import all in each to be safe, or specific ones)
# To be safe, we'll just inject `export` and let the IDE handle the rest, OR we can inject all imports into all files (tree-shaking will remove unused).
# Even better: just inject the `export` keyword before `const {Name} = {` and add `(window as any).{Name} = {Name};` at the end of each file.

for filename in files:
    if filename not in modules: continue
    
    mod_name = modules[filename]
    path = os.path.join(ts_dir, filename)
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace `const ModName = {` with `export const ModName = {`
    content = re.sub(rf"const\s+{mod_name}\s*=\s*{{", f"export const {mod_name} = {{", content)
    
    # Add window export
    if f"(window as any).{mod_name}" not in content:
        content += f"\n// Expose for HTML inline handlers\n(window as any).{mod_name} = {mod_name};\n"
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Added exports and window attachments!")
