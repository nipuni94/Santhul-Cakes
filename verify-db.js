
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'store.json');

try {
    console.log(`Reading from ${dbPath}`);
    const data = fs.readFileSync(dbPath, 'utf-8');
    const parsed = JSON.parse(data);
    console.log("JSON Parse Successful!");
    if (parsed.pages) {
        console.log("Pages found:", parsed.pages.length);
        parsed.pages.forEach(p => console.log(` - ${p.slug}`));
    } else {
        console.log("Pages array NOT found in parsed data");
    }
} catch (error) {
    console.error("JSON Parse FAILED:", error.message);
}
