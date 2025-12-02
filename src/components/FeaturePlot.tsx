'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { FeatureType, ChartDataPoint } from '@/types';

interface FeaturePlotProps {
  data: ChartDataPoint[];
  feature: FeatureType;
  startDate: string;
  endDate: string;
}

const FeaturePlot: React.FC<FeaturePlotProps> = ({ data, feature, startDate, endDate }) => {
  const getFeatureUnit = (feature: FeatureType): string => {
    switch (feature) {
      case 'Temperature':
        return '°C';
      case 'Humidity':
        return '%';
      case 'Population':
        return 'people';
      case 'Water Production':
        return 'L/hr';
      case 'pH Level':
        return 'pH';
      default:
        return '';
    }
  };

  const getFeatureColor = (feature: FeatureType): string => {
    switch (feature) {
      case 'Temperature':
        return '#ff6b35';
      case 'Humidity':
        return '#004e89';
      case 'Population':
        return '#7209b7';
      case 'Water Production':
        return '#1976d2';
      case 'pH Level':
        return '#2e7d32';
      default:
        return '#1976d2';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
          fontWeight: 600,
          color: '#b8336a',
          mb: 3
        }}
      >
        {feature} over Time ({startDate} - {endDate})
      </Typography>
      
      {data.length === 0 ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height={{ xs: 400, sm: 500, md: 600 }}
        >
          <Typography variant="body1" color="text.secondary">
            No data available for the selected date range
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: { xs: 400, sm: 500, md: 600, lg: 650 }, minHeight: 400 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={400}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#666"
              />
              <YAxis 
                stroke="#666"
                label={{ 
                  value: `${feature} (${getFeatureUnit(feature)})`, 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip 
                labelFormatter={formatTooltipLabel}
                formatter={(value: number) => [
                  `${value} ${getFeatureUnit(feature)}`,
                  feature
                ]}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={getFeatureColor(feature)}
                strokeWidth={2}
                dot={{ fill: getFeatureColor(feature), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getFeatureColor(feature), strokeWidth: 2 }}
                name={feature}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default FeaturePlot;