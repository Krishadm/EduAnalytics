import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

interface Props {
  labels: string[];
  data: number[];
  title?: string;
  color?: string;
}

export default function BarChart({ labels, data, title, color = '#6c63ff' }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Views',
        data,
        backgroundColor: `${color}99`,
        borderColor: color,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
      <Bar data={chartData} options={options} />
    </Box>
  );
}
