const fs = require('fs');

const content = fs.readFileSync('style.css', 'utf8');

// See if the file is just the same block repeated multiple times
const first1000 = content.substring(0, 1000);
let count = 0;
let pos = content.indexOf(first1000);

while (pos !== -1) {
  count++;
  console.log(`Found exact match of first 1000 chars at index: ${pos}`);
  pos = content.indexOf(first1000, pos + 1);
}

console.log(`Repeated ${count} times.`);
