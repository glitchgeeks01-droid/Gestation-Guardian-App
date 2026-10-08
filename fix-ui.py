import os
import re

with open('src/ts/components/ui.ts', 'r') as f:
    content = f.read()

pattern = r"(showToast\(.*?\}\n)"
replacement = r"\1    haptic() {\n        if (navigator.vibrate) navigator.vibrate([50]);\n    },\n"

content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)

with open('src/ts/components/ui.ts', 'w') as f:
    f.write(content)
