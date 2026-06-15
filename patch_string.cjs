const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'mapa_vulnerabilidad_combinado.html');
let html = fs.readFileSync(filePath, 'utf8');

const startStr = 'const DATOS    = [';
const startIndex = html.indexOf(startStr);

if (startIndex !== -1) {
  // Find the end of the line
  const endIndex = html.indexOf('\n', startIndex);
  if (endIndex !== -1) {
    const before = html.substring(0, startIndex);
    const after = html.substring(endIndex);
    html = before + 'let DATOS = [];' + after;
    console.log('Successfully removed DATOS using string manipulation.');
  }
} else {
  console.log('Could not find const DATOS');
}

html = html.replace(/fetch\(DATOS_URL\)/g, "fetch('/data.json')");

fs.writeFileSync(filePath, html, 'utf8');
