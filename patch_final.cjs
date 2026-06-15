const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'mapa_vulnerabilidad_combinado.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Remove 2MB DATOS array safely
const startStr = 'const DATOS    = [';
const startIndex = html.indexOf(startStr);
if (startIndex !== -1) {
  const endIndex = html.indexOf('\n', startIndex);
  if (endIndex !== -1) {
    html = html.substring(0, startIndex) + 'let DATOS = [];' + html.substring(endIndex);
  }
}

// 2. Remove fetch(DATOS_URL)
html = html.replace("fetch(DATOS_URL)", "fetch('/data.json')");

// 3. Remove the HTML stats block
const statsHtml = `  <!-- Stats -->
  <div class="sec">
    <div class="sec-t">Resumen — <span id="lbl-capa">Capa B</span></div>
    <div class="sg" id="stats-grid"></div>
  </div>`;
html = html.replace(statsHtml, '');

// 4. Remove actualizarStats() function
const functionStart = `// ══════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════
function actualizarStats() {
  const capa = document.getElementById('filtro-capa').value;
  const ns = capa==='a'?DATOS.map(d=>d.nivel_a):datosB.map(d=>d.nivel_b);
  const total = ns.length, c={};
  ns.forEach(n=>{c[n]=(c[n]||0)+1;});
  document.getElementById('stats-grid').innerHTML =
    [['Bajo','c-b'],['Medio','c-m'],['Alto','c-a'],['Muy Alto','c-ma']].map(([n,cls])=>{
      const v=c[n]||0;
      return \`<div class="sc"><div class="n \${cls}">\${v}</div><div class="l">\${n} (\${total?(v/total*100).toFixed(0):0}%)</div></div>\`;
    }).join('');
}`;
html = html.replace(functionStart, '');

// 5. Remove references to actualizarStats()
html = html.replace('actualizarLista(); actualizarStats();', 'actualizarLista();');
html = html.replace('actualizarLista(); actualizarStats();', 'actualizarLista();'); // if multiple

fs.writeFileSync(filePath, html, 'utf8');
console.log('Patch applied successfully.');
