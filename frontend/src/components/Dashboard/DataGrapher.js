import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const DataGrapher = () => {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${API_URL}/api/observations`);

                // Process data for charts
                const typeCounts = res.data.reduce((acc, curr) => {
                    acc[curr.type] = (acc[curr.type] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Object.keys(typeCounts).map(key => ({
                    name: key.replace('_', ' ').toUpperCase(),
                    count: typeCounts[key]
                }));

                setStats(chartData);
                setData(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) return <div className="dashboard-container">Loading Visualization...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Data Visualization Lab</h1>
                <p>Explore trends in community collected data.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                    <h3>Observation Types</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#4361ee" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Raw Data Preview</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>ID</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Type</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Date</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 5).map(obs => (
                                <tr key={obs.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '12px' }}>{obs.id}</td>
                                    <td style={{ padding: '12px' }}>{obs.type}</td>
                                    <td style={{ padding: '12px' }}>{new Date(obs.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px' }}>{obs.latitude.toFixed(2)}, {obs.longitude.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataGrapher;
