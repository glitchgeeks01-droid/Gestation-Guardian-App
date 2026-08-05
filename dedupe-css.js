const fs = require('fs');

const css = fs.readFileSync('style.css', 'utf8');

// A simple CSS parser for non-nested CSS
const rules = new Map();
const rootVars = new Map();

// Remove comments to simplify parsing
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

const regex = /([^{]+)\{([^}]+)\}/g;
let match;

let cssOrder = []; // To preserve original order of selectors as much as possible

while ((match = regex.exec(cssNoComments)) !== null) {
  let selector = match[1].trim();
  let block = match[2].trim();
  
  // Normalize selector spacing for deduplication
  selector = selector.replace(/\s+/g, ' ');

  if (selector === ':root') {
    // Merge CSS variables
    const props = block.split(';');
    for (let prop of props) {
      if (prop.trim()) {
        const [k, ...v] = prop.split(':');
        rootVars.set(k.trim(), v.join(':').trim());
      }
    }
  } else {
    if (!rules.has(selector)) {
      rules.set(selector, new Map());
      cssOrder.push(selector);
    }
    
    // Merge properties
    const props = block.split(';');
    const propMap = rules.get(selector);
    for (let prop of props) {
      if (prop.trim()) {
        const idx = prop.indexOf(':');
        if (idx > -1) {
          const k = prop.substring(0, idx).trim();
          const v = prop.substring(idx + 1).trim();
          propMap.set(k, v);
        }
      }
    }
  }
}

let output = '/* =========================================\n   DEDUPLICATED STYLE.CSS\n   ========================================= */\n\n';

if (rootVars.size > 0) {
  output += ':root {\n';
  for (let [k, v] of rootVars.entries()) {
    output += `  ${k}: ${v};\n`;
  }
  output += '}\n\n';
}

for (let selector of cssOrder) {
  if (selector === ':root') continue;
  
  output += `${selector} {\n`;
  for (let [k, v] of rules.get(selector).entries()) {
    output += `  ${k}: ${v};\n`;
  }
  output += '}\n\n';
}

fs.writeFileSync('style.css', output, 'utf8');
console.log(`Deduplication complete. Old size: ${css.length}, New size: ${output.length}`);
