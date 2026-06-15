import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Home, Users } from 'lucide-react';

export default function AnalysisTab({ dark }) {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        setDatos(data);
        setLoading(false);
      })
      .catch(err => console.error("Error cargando datos:", err));
  }, []);

  if (loading) {
    return <div style={{ color: dark ? '#fff' : '#000', padding: 40, textAlign: 'center' }}>Cargando datos...</div>;
  }

  const totalPob = datos.reduce((acc, d) => acc + (d.poblacion || 0), 0);
  const byLevel = { 'Bajo': 0, 'Medio': 0, 'Alto': 0, 'Muy Alto': 0 };
  
  datos.forEach(d => {
    if (byLevel[d.nivel_a] !== undefined) {
      byLevel[d.nivel_a]++;
    }
  });

  const pieData = Object.keys(byLevel).map(k => ({ name: k, value: byLevel[k] })).filter(d => d.value > 0);
  const COLORS = { 'Bajo': '#48bb78', 'Medio': '#4299e1', 'Alto': '#ed8936', 'Muy Alto': '#e53e3e' };

  const top10 = [...datos].sort((a, b) => b.indice_orig - a.indice_orig).slice(0, 10);

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
      <h2 style={{ ...textStyle, marginBottom: 20, fontSize: 24, fontWeight: 700 }}>Análisis de Vulnerabilidad</h2>
      
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
            <span style={subStyle}>Población Total (Registrada)</span>
          </div>
          <div style={{ ...textStyle, fontSize: 32, fontWeight: 700 }}>{totalPob.toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
            <AlertCircle size={24} color="#e53e3e" />
            <span style={subStyle}>Comunidades Riesgo Muy Alto</span>
          </div>
          <div style={{ ...textStyle, fontSize: 32, fontWeight: 700 }}>{byLevel['Muy Alto']}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        <div style={cardStyle}>
          <h3 style={{ ...textStyle, fontSize: 16, marginBottom: 20, fontWeight: 600 }}>Distribución por Nivel de Riesgo (Capa A)</h3>
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
          <h3 style={{ ...textStyle, fontSize: 16, marginBottom: 20, fontWeight: 600 }}>Top 10 Comunidades más Vulnerables</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#2d3748' : '#e2e8f0'} horizontal={true} vertical={false} />
                <XAxis type="number" stroke={dark ? '#718096' : '#a0aec0'} />
                <YAxis dataKey="nombre" type="category" width={100} stroke={dark ? '#718096' : '#a0aec0'} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: dark ? '#1a2035' : '#fff', border: dark ? '1px solid #2d3748' : '1px solid #e2e8f0', color: dark ? '#fff' : '#000', borderRadius: 8 }} />
                <Bar dataKey="indice_orig" fill="#e94362" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
