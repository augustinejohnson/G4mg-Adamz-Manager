const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let scriptMatch = html.match(/<script>\s*const DEFAULT_CONFIG[\s\S]*?<\/script>/i);
if (!scriptMatch) {
    console.log("Could not find the main script block");
    process.exit(1);
}

let code = scriptMatch[0].replace(/<script>|<\/script>/g, '');

try {
    new Function(code);
    console.log("Syntax is valid!");
} catch (e) {
    console.error("Syntax Error found:", e.message);
    // Print the line that failed roughly
    const lines = code.split('\n');
    const errMatch = e.stack.match(/<anonymous>:(\d+):(\d+)/);
    if (errMatch) {
        const lineNum = parseInt(errMatch[1]) - 2; // Offset for new Function
        console.error("Around line:", lines[lineNum]);
    }
}
