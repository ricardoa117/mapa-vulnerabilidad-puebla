# 🗺 Sistema TIA — Mapa de Vulnerabilidad Social · Puebla

> Herramienta web interactiva para identificar y comparar comunidades en situación de vulnerabilidad en el estado de Puebla, México, a partir de datos del INEGI (Censo de Población y Vivienda 2020).

**🔗 Demo en vivo:** [mapa-vulnerabilidad-puebla.vercel.app](https://mapa-vulnerabilidad-puebla.vercel.app)

---

## 📌 Contexto

Este proyecto nació como parte de una investigación de campo enfocada en llevar apoyo y acompañamiento a comunidades vulnerables del estado de Puebla. El objetivo fue construir una herramienta visual que permitiera identificar, priorizar y comparar localidades según distintos criterios de vulnerabilidad social, usando fuentes de datos oficiales y abiertas del INEGI.

---

## ✨ ¿Qué hace?

### Autenticación

Acceso protegido mediante login conectado a **Supabase**. Solo usuarios registrados en la tabla `usuarios_sistema` pueden ingresar al sistema.

### Mapa interactivo con dos capas comparables

Ambas capas trabajan sobre el mismo dataset de 6,568 localidades del estado de Puebla:

| Capa | Metodología | ¿Editable? |
|------|-------------|------------|
| **Capa A — Percentiles** | Clasifica cada localidad según su posición real en la distribución del índice (cuartiles del dataset) | ❌ Fija |
| **Capa B — Pesos editables** | Recalcula el índice asignando el peso que el usuario quiera a cada indicador | ✅ Ajustable |

### Funcionalidades principales

- 🔄 **Toggle por capa** — activa o desactiva cada metodología de forma independiente
- 🔍 **Modo comparación** — colorea cada localidad según si ambas metodologías coinciden o divergen
  - 🟢 Verde: coinciden en el nivel de vulnerabilidad
  - 🟡 Amarillo: difieren 1 nivel
  - 🔴 Rojo: difieren 2 o más niveles
- ⚙️ **Ajuste de pesos en tiempo real** — sliders para redistribuir el peso de cada indicador, con normalización automática a 100%
- 🌙☀️ **Modo oscuro / claro** — cambia también el tile base del mapa (CartoDB Dark / Light)
- 🔎 **Búsqueda y filtrado** — por nombre de localidad, municipio y nivel de vulnerabilidad
- 📊 **Resumen estadístico** — conteo y porcentaje por nivel en tiempo real
- 👤 **Dashboard con sesión activa** — muestra el nombre del usuario y permite cerrar sesión

---

## 📊 Indicadores utilizados

Los indicadores provienen del **Censo de Población y Vivienda 2020 (INEGI)**:

| Indicador | Variable CSV |
|-----------|-------------|
| Población sin escolaridad | `%_NO_ESCOLAR` |
| Analfabetismo | `%_ANALFABETISMO` |
| Viviendas con piso de tierra | `%_PISO_TIERRA` |
| Viviendas sin acceso a agua | `%_SIN_AGUA` |
| Viviendas sin drenaje | `%_SIN_DRENAJE` |
| Índice de hacinamiento | `HACINAMIENTO` |

### Clasificación — Capa A (Percentiles)

Los umbrales se calculan automáticamente a partir de la distribución real del dataset:

```
Bajo      →  ≤ p25
Medio     →  p25 < x ≤ p50
Alto      →  p50 < x ≤ p75
Muy Alto  →  > p75
```

### Clasificación — Capa B (Pesos editables)

El índice se recalcula como combinación lineal ponderada. Umbrales fijos: 25 / 50 / 75.

Pesos por defecto:
```
Sin escolaridad  20%    Sin agua       15%
Analfabetismo    20%    Sin drenaje    15%
Piso de tierra   15%    Hacinamiento   15%
```

---

## 🏗 Arquitectura

```
Frontend (React + Vite)
    ↓ login
Supabase (tabla usuarios_sistema)
    ↓ autenticado
Dashboard → iframe con mapa HTML generado por Python

mapa_vulnerabilidad_combinado.py
    → lee vulnerabilidad_puebla_final.csv (6,568 localidades)
    → calcula percentiles y sub-índices
    → genera mapa_vulnerabilidad_combinado.html (Leaflet.js)
```

---

## 🚀 Instalación local

### Requisitos

```bash
# Python
pip install pandas folium numpy

# Node.js 18+
npm install
```

### 1. Generar el mapa

```bash
python mapa_vulnerabilidad_combinado.py
# Genera: mapa_vulnerabilidad_combinado.html
# Muévelo a: frontend/public/
```

### 2. Variables de entorno

Crea `.env` en la carpeta `frontend/`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. Correr en desarrollo

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Estructura del repositorio

```
├── mapa_vulnerabilidad_combinado.py   # Script principal — genera el mapa HTML
├── mapa_vulnerabilidad_app.py         # Versión anterior (referencia histórica)
├── vulnerabilidad_puebla_final.csv    # Dataset procesado — INEGI 2020, 6568 localidades
├── DOCUMENTACION_TIA.docx             # Documentación metodológica completa
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Router login ↔ dashboard
│   │   ├── supabase.js                # Cliente Supabase
│   │   └── components/
│   │       ├── Login.jsx              # Pantalla de acceso con canvas animado
│   │       └── Dashboard.jsx          # Header de sesión + iframe del mapa
│   ├── public/
│   │   └── mapa_vulnerabilidad_combinado.html  # Mapa generado (excluido de git)
│   ├── vercel.json
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🗃 Fuentes de datos

- **INEGI** — Censo de Población y Vivienda 2020 — [inegi.org.mx](https://www.inegi.org.mx/programas/ccpv/2020/)
- **Marco Geoestadístico 2024** — INEGI — [inegi.org.mx/temas/mg](https://www.inegi.org.mx/temas/mg/)
- **DENUE 2021** — Directorio Estadístico Nacional — [inegi.org.mx](https://www.inegi.org.mx/app/mapa/denue/)

> Los datos crudos del INEGI no se incluyen en el repositorio por su tamaño. Se descargan directamente desde los enlaces anteriores.

---

## 🧭 Decisiones metodológicas

**¿Por qué dos capas?**

La **Capa A (percentiles)** refleja la distribución *real* del índice dentro del dataset: una localidad es "muy vulnerable" si está en el cuartil superior respecto a todas las demás del estado. Es útil para priorización relativa.

La **Capa B (pesos editables)** permite explorar sensibilidades metodológicas: ¿qué pasa si el acceso al agua pesa más que el analfabetismo? ¿Cambia el mapa significativamente? ¿Qué comunidades son vulnerables independientemente de los pesos?

El **modo comparación** responde exactamente esa pregunta, pintando cada localidad según el grado de acuerdo entre ambas metodologías.

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Procesamiento de datos | Python · Pandas · NumPy |
| Generación del mapa | Folium · Leaflet.js |
| Frontend / Auth | React · Vite · Supabase |
| Tiles del mapa | CartoDB (Dark / Light) |
| Despliegue | Vercel |

---

## 📄 Licencia

MIT — libre para usar, modificar y distribuir con atribución.

---

*Proyecto desarrollado como parte de una investigación sobre desarrollo comunitario y vulnerabilidad social en Puebla, México.*  
*Demo en vivo: [mapa-vulnerabilidad-puebla.vercel.app](https://mapa-vulnerabilidad-puebla.vercel.app)*
