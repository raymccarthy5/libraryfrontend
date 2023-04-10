import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import axios from '../api/axios';

const ReservationsByBookPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReservationsByBook();
  }, []);

  const fetchReservationsByBook = async () => {
    try {
      const response = await axios.get('/stats/reservations-by-book');
      const jsonData = await response.data;
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#d5d5d5',
    '#A0A0A0', '#E86850', '#82ca9d', '#FFD700', '#7c4dff',
    '#f44336', '#9c27b0', '#3f51b5', '#03a9f4', '#8bc34a',
    '#ffeb3b', '#ff9800', '#ff5722', '#795548', '#607d8b',
  ];

  const renderCustomLegend = () => (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {data.map((entry, index) => (
        <li key={`legend-item-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ width: '1rem', height: '1rem', backgroundColor: COLORS[index % COLORS.length], marginRight: '0.5rem' }}></div>
          <span>{`${entry.title}: ${entry.count}`}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="title"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      {renderCustomLegend()}
    </div>
  );
  
};

export default ReservationsByBookPieChart;