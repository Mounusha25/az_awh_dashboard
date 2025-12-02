'use client';

import React from 'react';
import { Typography, Box, Fade, Link as MuiLink } from '@mui/material';
import StationCard from '@/components/StationCard';
import { stations } from '@/data/constants';

export default function Home() {
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
            Total Stations: {stations.length} | 
            Online: {stations.filter(s => s.status === 'Online').length} | 
            Offline: {stations.filter(s => s.status === 'Offline').length}
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
        {stations.map((station, index) => (
          <Fade key={station.id} in={true} timeout={500 + index * 100}>
            <Box sx={{ width: '100%', maxWidth: '380px', display: 'flex' }}>
              <StationCard station={station} />
            </Box>
          </Fade>
        ))}
      </Box>
      </Box>

      {/* Technology & Research Section */}
      <Box 
        sx={{ 
          py: 10, 
          px: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {/* Section Title */}
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              mb: 1.5,
              fontWeight: 700,
              color: '#191919',
              textAlign: 'center',
              letterSpacing: '-0.5px'
            }}
          >
            Atmospheric Water Harvesting Technology
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              mb: 7,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.7,
              color: '#484848',
              fontWeight: 400,
              fontSize: { xs: '1.05rem', sm: '1.1rem', md: '1.15rem' }
            }}
          >
            Pioneering research in sustainable water solutions for Arizona's future
          </Typography>

          {/* Content Grid */}
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              mb: 5
            }}
          >
            {/* Left Column - Mission */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  p: 4.5,
                  height: '100%',
                  background: '#ffffff',
                  borderRadius: 2,
                  border: '2px solid #901340',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(144, 19, 64, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#901340',
                    mb: 3,
                    fontSize: '1.5rem',
                    letterSpacing: '-0.3px'
                  }}
                >
                  Our Mission
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8,
                    color: '#2b2b2b',
                    mb: 2.5,
                    fontSize: '1rem'
                  }}
                >
                  The Arizona Atmospheric Water Harvesting (AzAWH) project represents a groundbreaking approach to addressing water scarcity in arid regions. By extracting water directly from the atmosphere, we're developing sustainable solutions for one of the Southwest's most critical challenges.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8,
                    color: '#2b2b2b',
                    fontSize: '1rem'
                  }}
                >
                  Our testbeds monitor environmental conditions, water production efficiency, and energy consumption across diverse Arizona climate zones, providing invaluable data for optimizing AWH technology.
                </Typography>
              </Box>
            </Box>

            {/* Right Column - Research Partnerships */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  p: 4.5,
                  height: '100%',
                  background: '#ffffff',
                  borderRadius: 2,
                  border: '2px solid #ffcb25',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(255, 203, 37, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#ffcb25',
                    mb: 3.5,
                    fontSize: '1.5rem',
                    letterSpacing: '-0.3px'
                  }}
                >
                  Research Partnerships
                </Typography>
                
                <Box sx={{ mb: 3.5 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#191919',
                      mb: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    Arizona State University
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.7,
                      color: '#484848',
                      fontSize: '0.95rem'
                    }}
                  >
                    Leading academic research and innovation in atmospheric water harvesting technology and sustainable water resource management.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3.5 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#191919',
                      mb: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    Salt River Project (SRP)
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.7,
                      color: '#484848',
                      fontSize: '0.95rem'
                    }}
                  >
                    Collaborative industrial-scale testing to explore AWH integration with existing water and power infrastructure.
                  </Typography>
                </Box>

                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#191919',
                      mb: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    Climate Adaptation Research
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.7,
                      color: '#484848',
                      fontSize: '0.95rem'
                    }}
                  >
                    Developing data-driven insights to support climate resilience and water security strategies for the Southwest region.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Stats Row */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 3,
              mt: 3
            }}
          >
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 4,
                background: '#ffffff',
                borderRadius: 2,
                border: '2px solid #901340',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(144, 19, 64, 0.12)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#901340', mb: 1.5, fontSize: '2.5rem' }}>
                {stations.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#484848', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Stations
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                textAlign: 'center',
                p: 4,
                background: '#ffffff',
                borderRadius: 2,
                border: '2px solid #ffcb25',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(255, 203, 37, 0.12)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffcb25', mb: 1.5, fontSize: '2.5rem' }}>
                12+
              </Typography>
              <Typography variant="body2" sx={{ color: '#484848', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Parameters Tracked
              </Typography>
            </Box>

            <Box 
              sx={{ 
                textAlign: 'center',
                p: 4,
                background: '#ffffff',
                borderRadius: 2,
                border: '2px solid #901340',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(144, 19, 64, 0.12)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#901340', mb: 1.5, fontSize: '2.5rem' }}>
                24/7
              </Typography>
              <Typography variant="body2" sx={{ color: '#484848', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Real-time Monitoring
              </Typography>
            </Box>

            <Box 
              sx={{ 
                textAlign: 'center',
                p: 4,
                background: '#ffffff',
                borderRadius: 2,
                border: '2px solid #ffcb25',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(255, 203, 37, 0.12)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffcb25', mb: 1.5, fontSize: '2.5rem' }}>
                100%
              </Typography>
              <Typography variant="body2" sx={{ color: '#484848', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sustainable Water
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
