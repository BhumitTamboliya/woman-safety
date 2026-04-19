import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const Reports = ({ reports }) => {
  if (!reports) return <div className="tab-content"><div className="empty-state">Loading reports...</div></div>;

  return (
    <div className="tab-content">
      <h2 className="page-title">Incident Reports</h2>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Alerts by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reports.byStatus.map(d => ({ name: d._id, count: d.count }))}>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#1a1f3a', border: 'none', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#ff2d55" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Alerts by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reports.byType.map(d => ({ name: d._id, count: d.count }))}>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#1a1f3a', border: 'none', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {reports.byDay?.length > 0 && (
          <div className="chart-card full-width">
            <h3>Alerts Trend (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={reports.byDay.map(d => ({ date: d._id, count: d.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1f3a" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ background: '#1a1f3a', border: 'none', borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="#ff2d55" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;