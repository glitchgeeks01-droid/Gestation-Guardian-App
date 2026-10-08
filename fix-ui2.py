import os

with open('src/ts/components/ui.ts', 'r') as f:
    content = f.read()

# 1. Remove the incorrectly injected haptic block
bad_code = '''        if ((window as any).lucide) {
            (window as any).lucide.createIcons({ root: toast });
        }
    haptic() {
        if (navigator.vibrate) navigator.vibrate([50]);
    },'''
good_code = '''        if ((window as any).lucide) {
            (window as any).lucide.createIcons({ root: toast });
        }'''
content = content.replace(bad_code, good_code)

# 2. Append haptic to the end of the UI object
end_of_ui = '''                default:
                    console.warn('Unhandled UI action:', action);
            }
    }
};'''
end_of_ui_new = '''                default:
                    console.warn('Unhandled UI action:', action);
            }
    },

    haptic() {
        if (navigator.vibrate) navigator.vibrate([50]);
    }
};'''
content = content.replace(end_of_ui, end_of_ui_new)

with open('src/ts/components/ui.ts', 'w') as f:
    f.write(content)
