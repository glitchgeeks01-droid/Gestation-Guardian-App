import os
import re

ts_dir = "src/ts"
files = [f for f in os.listdir(ts_dir) if f.endswith(".ts")]

modules = ["App", "Assessment", "Auth", "Bluetooth", "Charts", "Kicks", "Scoring", "Store", "UI", "Vitals"]

for filename in files:
    if not filename.endswith(".ts"): continue
    
    path = os.path.join(ts_dir, filename)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    imports_to_add = []
    current_module = filename.replace(".ts", "").capitalize()
    
    for mod in modules:
        if mod.lower() == current_module.lower():
            continue
        
        # Check if the module is used in the file
        if re.search(rf"\b{mod}\.", content) or re.search(rf"\b{mod}\b", content):
            imports_to_add.append(f"import {{ {mod} }} from './{mod.lower()}';")
            
    if imports_to_add:
        # Prepend imports to the file
        new_content = "\n".join(imports_to_add) + "\n\n" + content
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)

print("Imports added!")
