import fs from 'fs';
import path from 'path';

const searchTerms = [
  'WoolConnect',
  'Wool',
  'Sheep',
  'Fleece',
  'Fiber',
  'Shearing',
  'Micron',
  'Staple',
  'Crimp',
  'Flock',
  'admin@woolconnect.in',
];

const rootDir = 'd:/vscode/indian bis/honey-chain';
const results = [];

function walk(dir) {
  fs.readdirSync(dir).forEach((f) => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== 'dist' && f !== '.git' && f !== '.system_generated') {
        walk(full);
      }
    } else {
      if (f.endsWith('.log') || f.endsWith('.ico') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.docx')) return;
      try {
        const content = fs.readFileSync(full, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          for (const term of searchTerms) {
            const regex = new RegExp(`\\b${term}\\b`, 'i');
            if (regex.test(line)) {
              results.push({
                file: path.relative(rootDir, full),
                lineNum: idx + 1,
                term,
                line: line.trim().slice(0, 120),
              });
              break;
            }
          }
        });
      } catch (e) {}
    }
  });
}

walk(rootDir);
console.log(`Total occurrences found: ${results.length}`);
results.forEach((r) => {
  console.log(`[${r.file}:${r.lineNum}] (${r.term}) -> ${r.line}`);
});
