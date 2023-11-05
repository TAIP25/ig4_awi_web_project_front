import * as React from 'react';
import { XAxis, YAxis, ResponsiveContainer, BarChart, Tooltip, Legend, Bar } from 'recharts';
import Title from './Title';
import Benevole from '../../interfaces/Benevole';

// Generate Inscription Data
function createData(benevoles: Benevole[]) {
  return benevoles.reduce((acc: {name: string, inscription: number}[], benevole: Benevole) => {
    const date = benevole.createdAt.toString().split('T')[0];
    const index = acc.findIndex((element) => element.name === date);
    if (index !== -1) {
      acc[index].inscription += 1;
    } else {
      acc.push({name: date, inscription: 1});
    }
    return acc;
  }
  , []).sort((a, b) => {
    const dateA = new Date(a.name);
    const dateB = new Date(b.name);
    return dateA.getTime() - dateB.getTime();
  });
}

export default function Chart({benevoles}: {benevoles: Benevole[]}) {

  return (
    <React.Fragment>
      <Title>Cette semaine</Title>
      <ResponsiveContainer>
        <BarChart
          data={createData(benevoles)}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="inscription"
            fill="#1976d2"
          />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}