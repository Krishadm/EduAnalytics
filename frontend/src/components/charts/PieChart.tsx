import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#6c63ff', '#00c896', '#ff6b6b', '#ffa500', '#00bcd4', '#e91e63'];

interface Props {
  labels: string[];
  data: number[];
  title?: string;
}

export default function PieChart({ labels, data }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: COLORS.map((c) => `${c}bb`),
        borderColor: COLORS,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#8892a4',
          font: { size: 12 },
          padding: 16,
          boxWidth: 12,
          borderRadius: 4,
        },
      },
      tooltip: {
        backgroundColor: '#1a1f35',
        borderColor: 'rgba(108,99,255,0.3)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#8892a4',
      },
    },
  };

  return (
    <Box sx={{ height: 260 }}>
      <Pie data={chartData} options={options} />
    </Box>
  );
}
