'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Box, Fade, Link as MuiLink, CircularProgress, Alert } from '@mui/material';
import StationCard from '@/components/StationCard';
import { apiClient, type StationInfo, type SystemStats } from '@/lib/api-client';

export default function Home() {
  const [stations, setStations] = useState<StationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sysStats, setSysStats] = useState<SystemStats | null>(null);

  useEffect(() => {
    async function fetchStations() {
      try {
        setLoading(true);
        const data = await apiClient.getStations();
        setStations(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stations');
      } finally {
        setLoading(false);
      }
    }

    async function fetchStats() {
      try {
        const stats = await apiClient.getStats();
        setSysStats(stats);
      } catch (err) {
        console.error('Failed to fetch system stats:', err);
      }
    }

    fetchStations();
    fetchStats();
  }, []);

  // Map API data to StationCard format
  const stationCards = stations.map((station, index) => ({
    id: station.station_name, // Use station_name as ID for routing
    name: station.station_name,
    location: station.location || 'Arizona, USA',  // Default location
    status: (station.status === 'active' ? 'Online' : 'Offline') as 'Online' | 'Offline',
    units: [station.unit],
    image: undefined,  // Let it use default random image
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} sx={{ color: '#901340' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section - Full Page */}
      <Box
        sx={{
          position: 'relative',
          height: 'calc(100vh - 80px)',
          minHeight: '600px',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            px: { xs: 2, md: 4 },
            zIndex: 1,
          }}
        >
          <MuiLink
            href="https://azawh.asu.edu/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem', lg: '5rem' },
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Arizona Atmospheric Water Harvesting (AzAWH) Testbeds
            </Typography>
          </MuiLink>
          <Typography
            variant="h3"
            sx={{
              color: '#ffcb25',
              fontWeight: 600,
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' },
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
              lineHeight: 1.4,
              fontStyle: 'italic',
            }}
          >
            Harvesting Tomorrow's Water, Today
          </Typography>
        </Box>
      </Box>

      {/* Stations Section */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 6, maxWidth: '1400px', mx: 'auto' }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            mb: 1,
            fontWeight: 700,
            color: '#191919',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}
        >
          Our Stations
        </Typography>

        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#484848', fontSize: '0.95rem' }}>
            Total Stations: {stationCards.length} | 
            Online: {stationCards.filter(s => s.status === 'Online').length} | 
            Offline: {stationCards.filter(s => s.status === 'Offline').length}
          </Typography>
        </Box>
      
      <Typography 
        variant="h6" 
        component="h2" 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 5, sm: 6, md: 7 },
          fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' },
          px: { xs: 2, sm: 1, md: 0 },
          color: '#484848',
          fontWeight: 400,
          lineHeight: 1.6
        }}
      >
        Monitor and manage water stations across all regions
      </Typography>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
          justifyItems: 'center',
        }}
      >
        {stationCards.map((station, index) => (
          <Fade key={station.id} in={true} timeout={500 + index * 100}>
            <Box sx={{ width: '100%', maxWidth: '380px', display: 'flex' }}>
              <StationCard station={station} />
            </Box>
          </Fade>
        ))}
      </Box>

      {/* Separator */}
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          my: 8
        }}
      >
        <Box sx={{ flex: 1, height: '2px', background: 'linear-gradient(to right, transparent, #901340, transparent)' }} />
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#901340', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            px: 2
          }}
        >
          LIVE STATISTICS
        </Typography>
        <Box sx={{ flex: 1, height: '2px', background: 'linear-gradient(to right, transparent, #901340, transparent)' }} />
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
          gap: 2,
          mb: 8,
        }}
      >
        {[
          {
            value: sysStats ? sysStats.stations_monitored.toString() : stations.length.toString(),
            label: 'Stations Monitored',
            color: '#901340',
          },
          {
            value: sysStats
              ? sysStats.total_data_points >= 1000
                ? `${(sysStats.total_data_points / 1000).toFixed(1)}K`
                : sysStats.total_data_points.toString()
              : '—',
            label: 'Data Points Ingested',
            color: '#ffcb25',
          },
          {
            value: sysStats ? sysStats.api_endpoints.toString() : '—',
            label: 'API Endpoints',
            color: '#901340',
          },
          {
            value: '14',
            label: 'Parameters Tracked',
            color: '#ffcb25',
          },
          {
            value: sysStats ? sysStats.uptime : '—',
            label: 'API Uptime',
            color: '#901340',
          },
          {
            value: sysStats
              ? sysStats.latest_reading
                ? new Date(sysStats.latest_reading).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : '—'
              : '—',
            label: 'Latest Reading',
            color: '#ffcb25',
          },
        ].map((stat, i) => (
          <Box
            key={i}
            sx={{
              textAlign: 'center',
              p: { xs: 2.5, md: 3 },
              background: '#ffffff',
              borderRadius: 2,
              border: `2px solid ${stat.color}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.25s ease',
              '&:hover': {
                boxShadow: `0 6px 20px ${stat.color}30`,
                transform: 'translateY(-3px)',
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: stat.color,
                fontSize: { xs: '1.5rem', md: '1.8rem' },
                lineHeight: 1.2,
                mb: 1,
                wordBreak: 'break-word',
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#484848',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.7rem',
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>

      </Box>
    </Box>
  );
}
