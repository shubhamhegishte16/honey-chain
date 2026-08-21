const fs = require("fs");

const source = JSON.parse(fs.readFileSync("./src/locales/en.json", "utf8"));
const marathi = JSON.parse(fs.readFileSync("./src/locales/mr.json", "utf8"));
const hindi = JSON.parse(fs.readFileSync("./src/locales/hi.json", "utf8"));
function flatten(object, prefix = "") {
  let result = {};

  for (const key in object) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      typeof object[key] === "object" &&
      object[key] !== null &&
      !Array.isArray(object[key])
    ) {
      result = { ...result, ...flatten(object[key], fullKey) };
    } else {
      result[fullKey] = object[key];
    }
  }

  return result;
}

const english = flatten(source);
const mr = flatten(marathi);
const hi = flatten(hindi);

const keys = Object.keys(english);

const missingMr = keys.filter(
  key =>
    !mr[key] ||
    mr[key].toString().trim() === "" ||
    mr[key] === english[key]
);

const missingHi = keys.filter(
  key =>
    !hi[key] ||
    hi[key].toString().trim() === "" ||
    hi[key] === english[key]
);

console.log(`Total translation keys: ${keys.length}`);
console.log(`Marathi translated: ${keys.length - missingMr.length}`);
console.log(`Marathi remaining: ${missingMr.length}`);
console.log(`Hindi translated: ${keys.length - missingHi.length}`);
console.log(`Hindi remaining: ${missingHi.length}`);

console.log("\nMarathi keys to translate:");
console.log(missingMr.join("\n"));

console.log("\nHindi keys to translate:");
console.log(missingHi.join("\n"));