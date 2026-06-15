const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'mapa_vulnerabilidad_combinado.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Remove the massive DATOS array
html = html.replace(/let DATOS = \[.*?\];/s, 'let DATOS = [];');

// 2. Remove the Stats sidebar section
html = html.replace(/<!-- Stats -->\s*<div class="sec">\s*<div class="sec-t">Resumen — <span id="lbl-capa">Capa B<\/span><\/div>\s*<div class="sg" id="stats-grid"><\/div>\s*<\/div>/g, '');

// 3. Remove actualizarStats function completely
html = html.replace(/\/\/ ══════════════════════════════════════════════════\s*\/\/ STATS\s*\/\/ ══════════════════════════════════════════════════\s*function actualizarStats\(\) \{[\s\S]*?\}/, '');

// 4. Remove calls to actualizarStats
html = html.replace(/actualizarStats\(\);/g, '');

// 5. User said "la parte del menu para ajustar tiene hasta abajo el vacio de donde estaban las comunidades, has que ocupen todo el espacio".
// The #lista-wrapper has 'min-height: 80px; flex: 1'. This should automatically fill available space since `#sidebar` is flex-direction: column.
// However, `#sidebar-fixed` has `max-height: 62vh`. Let's reduce it to `max-height: 45vh` or remove it so it scales properly? No, flex:1 works if parent is display: flex and has height. 
// Actually, let's just make sure it's clean.

fs.writeFileSync(filePath, html, 'utf8');
console.log('Stats and DATOS removed');
