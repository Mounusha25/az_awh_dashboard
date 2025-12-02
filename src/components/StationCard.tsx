'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { Circle as CircleIcon, Info as InfoIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Station } from '@/types';

interface StationCardProps {
  station: Station;
}

const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/stations/${station.id}`);
  };

  const getStatusColor = (status: string) => {
    return status === 'Online' ? 'success' : 'error';
  };

  const getStatusIconColor = (status: string) => {
    return status === 'Online' ? '#4caf50' : '#f44336';
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column',
        background: '#ffffff',
        border: '2px solid #1e88e5',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 28px rgba(30, 136, 229, 0.3)',
          borderColor: '#1565c0',
        }
      }}
      onClick={handleViewDetails}
    >
      <CardMedia
        component="img"
        height="200"
        image={station.image || `https://picsum.photos/400/300?random=${station.id}`}
        alt={station.name}
        sx={{ 
          objectFit: 'cover',
          borderBottom: '3px solid #1e88e5'
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{
              color: '#1e88e5',
              fontWeight: 600,
            }}
          >
            {station.name}
          </Typography>
          <Chip
            label={station.status}
            color={getStatusColor(station.status)}
            size="small"
            icon={<CircleIcon sx={{ fontSize: 14 }} />}
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            mb: 1.5,
            fontWeight: 600,
            color: '#555'
          }}
        >
          📍 {station.area}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            lineHeight: 1.7,
            mb: 1.5,
            color: '#666'
          }}
        >
          {station.description || "This atmospheric water harvesting station utilizes advanced condensation technology to extract moisture from ambient air, providing sustainable and reliable water solutions for the community."}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{
            mb: 0.5,
            color: '#555'
          }}
        >
          💧 <strong>Daily Capacity:</strong> 500-800 liters
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{
            mb: 0.5,
            color: '#555'
          }}
        >
          🌡️ <strong>Efficiency:</strong> 85-92%
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{
            color: '#555'
          }}
        >
          🕒 <strong>Last Updated:</strong> 2 hours ago
        </Typography>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="medium" 
          variant="contained" 
          startIcon={<InfoIcon />}
          fullWidth
          sx={{
            backgroundColor: '#1e88e5',
            color: 'white',
            fontWeight: 600,
            py: 1,
            '&:hover': {
              backgroundColor: '#1565c0',
              transform: 'translateY(-2px)',
            }
          }}
        >
          View Full Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default StationCard;