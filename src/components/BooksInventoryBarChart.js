import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from '../api/axios';

const BooksInventory = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getBooksInventory();
  }, []);

  const getBooksInventory = async () => {
    try {
      const response = await axios.get('/stats/books-inventory');
      const jsonData = await response.data;
      setData(jsonData);
    } catch (error) {
      console.error('Error geting data:', error);
    }
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0'];

  return (
    <div style={{ width: '100%', height: 400, overflowY: 'auto' }}>
      <ResponsiveContainer width="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" />
          <YAxis dataKey="title" type="category" width={150} />
          <Tooltip />
          <Bar dataKey="quantityAvailable">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BooksInventory;

