const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'mapa_vulnerabilidad_combinado.html');
let html = fs.readFileSync(filePath, 'utf8');

html = html.replace(/^const DATOS\s*=\s*\[.*\n/m, 'let DATOS = [];\n');
html = html.replace(/fetch\(DATOS_URL\)/g, "fetch('/data.json')");

fs.writeFileSync(filePath, html, 'utf8');
console.log('Fixed gracefully');
