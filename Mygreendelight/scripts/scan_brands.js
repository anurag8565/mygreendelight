const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        getFiles(filePath, fileList);
      }
    } else if (/\.(tsx|ts|jsx|js|json|html|css)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getFiles(path.join(__dirname, '../src'));

console.log(`Scanning ${allFiles.length} files in src/ for brand occurrences...\n`);

const brandPatterns = [
  /QuickBasket/g,
  /Quick Basket/g,
  /quickbasket/g,
  /FreshMart/g,
  /Fresh Mart/g,
  /freshmart/g,
  /Freshmart/g,
];

let matchCount = 0;
const matchedFiles = new Set();

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let fileMatches = false;

  for (const pattern of brandPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      matchCount += matches.length;
      fileMatches = true;
    }
  }

  if (fileMatches) {
    matchedFiles.add(filePath);
  }
}

console.log(`Found ${matchCount} occurrences across ${matchedFiles.size} files:`);
for (const f of matchedFiles) {
  console.log(`- ${path.relative(path.join(__dirname, '..'), f)}`);
}
