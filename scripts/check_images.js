const fs = require('fs');

const content = fs.readFileSync('src/data/tourist-destinations.ts', 'utf8');
const lines = content.split('\n');

let currentId = '';
let currentName = '';
const list = [];

for (const line of lines) {
  const idM = line.match(/"id":\s*"([^"]+)"/);
  if (idM) currentId = idM[1];

  const nameM = line.match(/"name":\s*"([^"]+)"/);
  if (nameM) currentName = nameM[1];

  const imgM = line.match(/"image":\s*"([^"]+)"/);
  if (imgM) {
    list.push({ id: currentId, name: currentName, image: imgM[1] });
  }
}

console.log('Total destinations with image:', list.length);
list.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.id}] ${item.name} -> ${item.image}`);
});
