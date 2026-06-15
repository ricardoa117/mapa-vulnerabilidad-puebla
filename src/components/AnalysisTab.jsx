import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Home, Users, Info } from 'lucide-react';

export default function AnalysisTab({ dark }) {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [capa, setCapa] = useState('B'); // 'A' or 'B'
  const [showInfo, setShowInfo] = useState(false);

  // Pesos ACP used in Capa B (default)
  const MAXS = {"NO_ESCOLAR": 100.0, "ANALFABETISMO": 85.7143, "PISO_TIERRA": 100.0, "SIN_AGUA": 100.0, "SIN_DRENAJE": 100.0, "HACINAMIENTO": 13.5};
  const PESOS_ACP = {"NO_ESCOLAR": 0.1147, "ANALFABETISMO": 0.1699, "PISO_TIERRA": 0.1923, "SIN_AGUA": 0.1409, "SIN_DRENAJE": 0.1615, "HACINAMIENTO": 0.2207};
  const META = { "pb25": 17.93, "pb50": 22.68, "pb75": 26.49 };

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        // Calculate capa B indices for analysis
        const norm = (d, k) => Math.min(100, (d[k.toLowerCase()] || 0) / MAXS[k] * 100);
        const calcIdxB = (d) => {
          return (
            norm(d, 'NO_ESCOLAR') * PESOS_ACP.NO_ESCOLAR +
            norm(d, 'ANALFABETISMO') * PESOS_ACP.ANALFABETISMO +
            norm(d, 'PISO_TIERRA') * PESOS_ACP.PISO_TIERRA +
            norm(d, 'SIN_AGUA') * PESOS_ACP.SIN_AGUA +
            norm(d, 'SIN_DRENAJE') * PESOS_ACP.SIN_DRENAJE +
            norm(d, 'HACINAMIENTO') * PESOS_ACP.HACINAMIENTO
          );
        };
        const nivelB = (v) => {
          if (v <= META.pb25) return 'Bajo';
          if (v <= META.pb50) return 'Medio';
          if (v <= META.pb75) return 'Alto';
          return 'Muy Alto';
        };

        const processed = data.map(d => {
          const ib = calcIdxB(d);
          return { ...d, indice_b: ib, nivel_b: nivelB(ib) };
        });

        setDatos(processed);
        setLoading(false);
      })
      .catch(err => console.error("Error cargando datos:", err));
  }, []);

  if (loading) {
    return <div style={{ color: dark ? '#fff' : '#000', padding: 40, textAlign: 'center' }}>Cargando datos...</div>;
  }

  const totalPob = datos.reduce((acc, d) => acc + (d.poblacion || 0), 0);
  
  // Calculate distribution based on selected capa
  const byLevel = { 'Bajo': 0, 'Medio': 0, 'Alto': 0, 'Muy Alto': 0 };
  datos.forEach(d => {
    const n = capa === 'A' ? d.nivel_a : d.nivel_b;
    if (byLevel[n] !== undefined) byLevel[n]++;
  });

  const pieData = Object.keys(byLevel).map(k => ({ name: k, value: byLevel[k] })).filter(d => d.value > 0);
  const COLORS = { 'Bajo': '#48bb78', 'Medio': '#4299e1', 'Alto': '#ed8936', 'Muy Alto': '#e53e3e' };

  // Top 10 based on selected capa
  const top10 = [...datos]
    .sort((a, b) => capa === 'A' ? (b.indice_orig - a.indice_orig) : (b.indice_b - a.indice_b))
    .slice(0, 10)
    .map(d => ({ ...d, score: capa === 'A' ? d.indice_orig : parseFloat(d.indice_b.toFixed(1)) }));

  const cardStyle = {
    background: dark ? '#1a2035' : '#ffffff',
    borderRadius: 12,
    padding: 20,
    boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)',
    border: `1px solid ${dark ? '#2d3748' : '#e2e8f0'}`,
    display: 'flex',
    flexDirection: 'column'
  };
  const textStyle = { color: dark ? '#e2e8f0' : '#1a202c' };
  const subStyle = { color: dark ? '#718096' : '#a0aec0', fontSize: 13 };

  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%', fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Header and Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ ...textStyle, fontSize: 24, fontWeight: 700, margin: 0 }}>Análisis de Vulnerabilidad</h2>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowInfo(!showInfo)} style={{
            background: 'none', border: `1px solid ${dark ? '#4a5568' : '#cbd5e0'}`, color: textStyle.color,
            padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
          }}>
            <Info size={16} /> Metodología
          </button>
          <div style={{ display: 'flex', background: dark ? '#2d3748' : '#edf2f7', borderRadius: 8, padding: 4 }}>
            <button onClick={() => setCapa('A')} style={{
              background: capa === 'A' ? (dark ? '#4a5568' : '#fff') : 'transparent',
              border: 'none', borderRadius: 6, padding: '6px 16px', color: textStyle.color, cursor: 'pointer',
              fontWeight: capa === 'A' ? 600 : 400, boxShadow: capa === 'A' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s'
            }}>Capa A</button>
            <button onClick={() => setCapa('B')} style={{
              background: capa === 'B' ? (dark ? '#4a5568' : '#fff') : 'transparent',
              border: 'none', borderRadius: 6, padding: '6px 16px', color: textStyle.color, cursor: 'pointer',
              fontWeight: capa === 'B' ? 600 : 400, boxShadow: capa === 'B' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s'
            }}>Capa B</button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div style={{
          ...cardStyle, marginBottom: 20, borderLeft: '4px solid #0092DD', background: dark ? 'rgba(0,146,221,0.05)' : 'rgba(0,146,221,0.02)'
        }}>
          <h4 style={{ ...textStyle, marginTop: 0, marginBottom: 10 }}>¿Cómo se calcula cada capa?</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 13, lineHeight: 1.6, color: dark ? '#cbd5e0' : '#4a5568' }}>
            <div>
              <strong style={{ color: '#f6ad55' }}>Capa A (Original)</strong>
              <p>Promedia las 6 variables tal como vienen. Esto tiene un sesgo matemático: mezcla porcentajes (0-100%) con hacinamiento (que es un valor de 0 a 14). Por lo tanto, el hacinamiento queda invisibilizado matemáticamente y el índice se domina por "Piso de Tierra". Aunque le "atina" a comunidades críticas porque éstas suelen tener todos los problemas simultáneamente, no es una métrica estadísticamente precisa.</p>
            </div>
            <div>
              <strong style={{ color: '#68d391' }}>Capa B (Recomendada)</strong>
              <p>Normaliza todas las variables a una escala de 0 a 100 antes de promediar. Así, el hacinamiento compite justamente. Además, usa pesos estadísticos (ACP) donde cada variable aporta según su varianza real. Es un modelo mucho más robusto para identificar comunidades vulnerables de forma justa y científica.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 20 }}>
        <div style={cardStyle}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
            <Home size={24} color="#0092DD" />
            <span style={subStyle}>Total Comunidades</span>
          </div>
          <div style={{ ...textStyle, fontSize: 32, fontWeight: 700 }}>{datos.length}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
            <Users size={24} color="#2fac66" />
            <span style={subStyle}>Población Registrada</span>
          </div>
          <div style={{ ...textStyle, fontSize: 32, fontWeight: 700 }}>{totalPob.toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
            <AlertCircle size={24} color="#e53e3e" />
            <span style={subStyle}>En Riesgo Muy Alto (Capa {capa})</span>
          </div>
          <div style={{ ...textStyle, fontSize: 32, fontWeight: 700 }}>{byLevel['Muy Alto']}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        <div style={cardStyle}>
          <h3 style={{ ...textStyle, fontSize: 16, marginBottom: 20, fontWeight: 600 }}>Distribución por Nivel de Riesgo (Capa {capa})</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: dark ? '#1a2035' : '#fff', border: dark ? '1px solid #2d3748' : '1px solid #e2e8f0', color: dark ? '#fff' : '#000', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ ...textStyle, fontSize: 16, marginBottom: 20, fontWeight: 600 }}>Top 10 Comunidades más Vulnerables (Capa {capa})</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#2d3748' : '#e2e8f0'} horizontal={true} vertical={false} />
                <XAxis type="number" stroke={dark ? '#718096' : '#a0aec0'} />
                <YAxis dataKey="nombre" type="category" width={110} stroke={dark ? '#718096' : '#a0aec0'} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: dark ? '#1a2035' : '#fff', border: dark ? '1px solid #2d3748' : '1px solid #e2e8f0', color: dark ? '#fff' : '#000', borderRadius: 8 }} />
                <Bar dataKey="score" fill={capa === 'A' ? '#f6ad55' : '#68d391'} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
