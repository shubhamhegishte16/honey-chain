const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(getFiles(fullPath));
      }
    } else if (file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const backendDir = path.resolve(__dirname, '../backend');
const files = getFiles(backendDir);
console.log(`Checking ${files.length} backend JS files...`);
let errCount = 0;
files.forEach(f => {
  try {
    execSync(`node --check "${f}"`);
  } catch (e) {
    console.error(`Syntax error in ${f}:`, e.message);
    errCount++;
  }
});

if (errCount === 0) {
  console.log(`ALL ${files.length} BACKEND FILES PASSED SYNTAX CHECK CLEANLY!`);
} else {
  console.error(`${errCount} files failed syntax check.`);
}
