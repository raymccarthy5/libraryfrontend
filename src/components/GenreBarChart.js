import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import axios from '../api/axios';

const GenreBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBooksByGenre();
  }, []);

  const fetchBooksByGenre = async () => {
    try {
      const response = await axios.get('/stats/genre-count');
      const jsonData = await response.data;
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0'];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="genre" angle={-90} textAnchor="end" interval={0} height={120} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="count"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenreBarChart;

