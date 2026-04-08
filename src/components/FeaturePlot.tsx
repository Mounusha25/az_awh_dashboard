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
  paramNames?: string[];
}

const FeaturePlot: React.FC<FeaturePlotProps> = ({ data, feature, startDate, endDate, paramNames }) => {
  const hasSecondParam = data.length > 0 && data[0].value2 !== undefined;
  const param1Name = paramNames?.[0] || feature;
  const param2Name = paramNames?.[1] || 'Parameter 2';

  // Downsample data if too many points for clean rendering
  const plotData = React.useMemo(() => {
    const MAX_POINTS = 500;
    if (data.length <= MAX_POINTS) return data;
    const step = Math.ceil(data.length / MAX_POINTS);
    return data.filter((_, i) => i % step === 0 || i === data.length - 1);
  }, [data]);

  // Determine if data spans multiple days to choose date vs time formatting
  const spansMultipleDays = React.useMemo(() => {
    if (plotData.length < 2) return false;
    const first = new Date(plotData[0].date);
    const last = new Date(plotData[plotData.length - 1].date);
    return first.toDateString() !== last.toDateString();
  }, [plotData]);

  // Compute tick interval: aim for ~10-15 ticks on x-axis
  const tickInterval = React.useMemo(() => {
    if (plotData.length <= 15) return 0;
    return Math.floor(plotData.length / 12);
  }, [plotData]);
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
    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    if (spansMultipleDays) {
      return `${date.getMonth() + 1}/${date.getDate()} ${time}`;
    }
    return time;
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
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
              data={plotData}
              margin={{
                top: 20,
                right: hasSecondParam ? 60 : 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#666"
                interval={tickInterval}
                angle={-35}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#1e88e5"
                label={{ 
                  value: param1Name, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#1e88e5' }
                }}
              />
              {hasSecondParam && (
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#e91e63"
                  label={{ 
                    value: param2Name, 
                    angle: 90, 
                    position: 'insideRight',
                    style: { fill: '#e91e63' }
                  }}
                />
              )}
              <Tooltip 
                labelFormatter={formatTooltipLabel}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="value"
                stroke="#1e88e5"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, stroke: '#1e88e5', strokeWidth: 2 }}
                name={param1Name}
              />
              {hasSecondParam && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="value2"
                  stroke="#e91e63"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, stroke: '#e91e63', strokeWidth: 2 }}
                  name={param2Name}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default FeaturePlot;