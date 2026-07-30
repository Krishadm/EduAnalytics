import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  labels: string[];
  data: number[];
  title?: string;
}

export default function LineChart({ labels, data, title }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Engagement',
        data,
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108,99,255,0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6c63ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1f35',
        borderColor: 'rgba(108,99,255,0.3)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#8892a4',
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#8892a4', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#8892a4', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ height: 280 }}>
      <Line data={chartData} options={options} />
    </Box>
  );
}
