const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'mapa_vulnerabilidad_combinado.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Add MarkerCluster CDNs
html = html.replace(
  '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>\r\n<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>',
  `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>\r\n<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>\r\n<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>\r\n<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>\r\n<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>`
);
// Try without \r if previous fails
html = html.replace(
  '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>\n<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>',
  `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>\n<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>\n<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>\n<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>\n<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>`
);


// 2. Add Glassmorphism CSS
const glassCSS = `
/* Popups Glassmorphism */
.leaflet-popup-content-wrapper {
  background: rgba(26, 32, 53, 0.85) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  color: #e2e8f0 !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
}
.leaflet-popup-tip {
  background: rgba(26, 32, 53, 0.85) !important;
  border: 1px solid rgba(255,255,255,0.1);
}
body.light .leaflet-popup-content-wrapper {
  background: rgba(255, 255, 255, 0.85) !important;
  border: 1px solid rgba(0,0,0,0.1);
  color: #1a202c !important;
}
body.light .leaflet-popup-tip {
  background: rgba(255, 255, 255, 0.85) !important;
  border: 1px solid rgba(0,0,0,0.1);
}
</style>
`;
html = html.replace('</style>', glassCSS);

// 3. Update datosB initialization to be empty initially
html = html.replace(
  'let datosB = DATOS.map(d => {\n  const ib = calcIdxB(d, pesos);\n  return {...d, indice_b: ib, nivel_b: nivelB(ib)};\n});',
  'let datosB = [];'
);
html = html.replace(
  'let datosB = DATOS.map(d => {\r\n  const ib = calcIdxB(d, pesos);\r\n  return {...d, indice_b: ib, nivel_b: nivelB(ib)};\r\n});',
  'let datosB = [];'
);

// 4. Update LayerGroups to MarkerClusterGroups
html = html.replace(
  'let layerA    = L.layerGroup().addTo(map);\r\nlet layerB    = L.layerGroup().addTo(map);\r\nlet layerComp = L.layerGroup();',
  'let layerA    = L.markerClusterGroup({ maxClusterRadius: 40 }).addTo(map);\nlet layerB    = L.markerClusterGroup({ maxClusterRadius: 40 }).addTo(map);\nlet layerComp = L.markerClusterGroup({ maxClusterRadius: 40 });'
);
html = html.replace(
  'let layerA    = L.layerGroup().addTo(map);\nlet layerB    = L.layerGroup().addTo(map);\nlet layerComp = L.layerGroup();',
  'let layerA    = L.markerClusterGroup({ maxClusterRadius: 40 }).addTo(map);\nlet layerB    = L.markerClusterGroup({ maxClusterRadius: 40 }).addTo(map);\nlet layerComp = L.markerClusterGroup({ maxClusterRadius: 40 });'
);


// 5. Update Popups text colors for Glassmorphism
html = html.replace(/#eee/g, 'rgba(136,136,136,0.3)');
html = html.replace(/color:#888/g, 'opacity:0.7');
html = html.replace(/color:#aaa/g, 'opacity:0.6');


// 6. Update INIT to fetch
const initOld = `// ══════════════════════════════════════════════════\r\n// INIT\r\n// ══════════════════════════════════════════════════\r\npoblarNiveles();\r\nredibujar();`;
const initOldN = `// ══════════════════════════════════════════════════\n// INIT\n// ══════════════════════════════════════════════════\npoblarNiveles();\nredibujar();`;
const initNew = `// ══════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════
fetch(DATOS_URL)
  .then(res => res.json())
  .then(data => {
    DATOS = data;
    datosB = DATOS.map(d => {
      const ib = calcIdxB(d, pesos);
      return {...d, indice_b: ib, nivel_b: nivelB(ib)};
    });
    poblarNiveles();
    redibujar();
  });`;

html = html.replace(initOld, initNew);
html = html.replace(initOldN, initNew);

// Make sure the bottom list flex is working. The list needs 'flex: 1' inside its container to fill space? 
// The user said: "y la parte del menu para ajustar tiene hasta abajo el vacio de donde estaban las comunidades, has que ocupen todo el espacio".
// Currently `#lista-wrapper` has `flex:1`, but maybe `flex: 1` needs to be `flex: 1 1 auto; height: 100%;`?
// Let's add min-height and flex grow.

fs.writeFileSync(filePath, html, 'utf8');
console.log('Patched HTML');
