'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ArrowBack, Circle as CircleIcon, CalendarMonth, Tune } from '@mui/icons-material';
import { format } from 'date-fns';
import FeaturePlot from '@/components/FeaturePlot';
import CSVExport from '@/components/CSVExport';
import { getStationById, sampleData, getDataForDateRange } from '@/data/constants';
import { FeatureType, ChartDataPoint, StationData } from '@/types';

// Define parameter categories and their sub-parameters
const parameterCategories = {
  'Intake Air': ['Temperature', 'Relative Humidity', 'Air Velocity', 'Absolute Humidity'],
  'Outtake Air': ['Temperature', 'Relative Humidity', 'Air Velocity', 'Absolute Humidity'],
  'Water Production': ['Flow Rate', 'Conductivity', 'pH', 'Amount of Water'],
  'Power Consumption': ['Power', 'Voltage', 'Current']
};

export default function StationDetails() {
  const params = useParams();
  const router = useRouter();
  const stationId = parseInt(params.id as string, 10);
  
  const station = getStationById(stationId);
  
  // Use static dates to avoid hydration mismatches
  const defaultEndDate = new Date('2025-10-30');
  const defaultStartDate = new Date('2025-10-24'); // 7 days before end date
  
  // State for mounted check
  const [mounted, setMounted] = useState(false);

  // Start with no selection so buttons show "Select ..." placeholders
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);

  // Dialog states
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [paramDialogOpen, setParamDialogOpen] = useState(false);

  // Temporary states for dialogs
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [tempUnit, setTempUnit] = useState<string>('');
  const [tempCategory, setTempCategory] = useState<string>('');
  const [tempParameters, setTempParameters] = useState<string[]>([]);

  // Handle mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle date period apply
  const handleDateApply = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setDateDialogOpen(false);
  };
  
  // Handle parameters apply
  const handleParamApply = () => {
    setSelectedUnit(tempUnit);
    setSelectedCategory(tempCategory);
    setSelectedParameters(tempParameters);
    setParamDialogOpen(false);
  };
  
  // Handle category change in dialog
  const handleTempCategoryChange = (category: string) => {
    setTempCategory(category);
    setTempParameters([]);
  };
  
  // Handle parameter selection (multiple)
  const handleParameterToggle = (parameter: string) => {
    setTempParameters(prev => {
      if (prev.includes(parameter)) {
        return prev.filter(p => p !== parameter);
      } else if (prev.length < 2) {
        return [...prev, parameter];
      }
      return prev;
    });
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Clear selected parameters when category changes
    setSelectedParameters([]);
  };

  // Demo helper: apply demo selections so users can preview charts
  const applyDemoSelection = () => {
    // Use the static defaults defined above
    setTempStartDate(defaultStartDate);
    setTempEndDate(defaultEndDate);
    setTempCategory('Intake Air');
    setTempParameters(['Temperature']);
    setTempUnit(station?.units && station.units.length > 0 ? station.units[0] : '');

    // Apply immediately
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setSelectedCategory('Intake Air');
    setSelectedParameters(['Temperature']);
    setSelectedUnit(station?.units && station.units.length > 0 ? station.units[0] : '');
  };
  
    const chartData: ChartDataPoint[] = useMemo(() => {
    if (!startDate || !endDate || selectedParameters.length === 0) return [];
    
    const data = getDataForDateRange(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    );
    
    // Map the data to chart format based on selected parameters
    // For now, we'll use the first selected parameter for the chart
    const featureKey = `${selectedCategory} - ${selectedParameters[0]}` as keyof StationData;
    
    return data.map(item => ({
      date: item.date,
      value: typeof item[featureKey] === 'number' ? item[featureKey] as number : 0
    }));
  }, [startDate, endDate, selectedCategory, selectedParameters]);
  
  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    return getDataForDateRange(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    );
  }, [startDate, endDate]);
  
  const handleBack = () => {
    router.push('/');
  };
  
  const getStatusColor = (status: string) => {
    return status === 'Online' ? 'success' : 'error';
  };
  
  const getStatusIconColor = (status: string) => {
    return status === 'Online' ? '#4caf50' : '#f44336';
  };
  
  if (!station) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">Station not found</Alert>
      </Box>
    );
  }
  
  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }
  
  const dateRangeString = startDate && endDate 
    ? `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`
    : '';
  
  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4, maxWidth: '1600px', mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleBack}
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(30, 136, 229, 0.08)'
              }
            }}
          >
            Back to Stations
          </Button>

          <Button
            variant="outlined"
            startIcon={<CalendarMonth />}
            onClick={applyDemoSelection}
            sx={{ ml: 'auto', color: 'primary.main', borderColor: 'primary.main' }}
          >
            Load Demo Data
          </Button>
        </Box>
      </motion.div>
      
      {/* Station Header with Photo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: 4,
            background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
              pointerEvents: 'none',
            }
          }}
        >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
          {/* Station Image */}
          <Box
            component="img"
            src={`https://picsum.photos/600/400?random=${stationId}`}
            alt={station.name}
            sx={{
              width: { xs: '100%', md: '450px' },
              height: { xs: '250px', md: '320px' },
              objectFit: 'cover',
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          />
          
          {/* Station Info */}
          <Box sx={{ flex: 1 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
              <Typography 
                variant="h3" 
                component="h1"
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
                }}
              >
                {station.name}
              </Typography>
              <Chip
                icon={<CircleIcon sx={{ fontSize: 16 }} />}
                label={station.status}
                color={getStatusColor(station.status)}
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  px: 1.5,
                  py: 2.5,
                  backgroundColor: 'white',
                  color: station.status === 'Online' ? '#4caf50' : '#f44336',
                }}
              />
            </Box>
            
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.95, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              📍 {station.area}
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 3, opacity: 0.9 }}>
              This state-of-the-art atmospheric water harvesting station represents the cutting edge of sustainable water technology. 
              Utilizing advanced condensation and filtration systems, it extracts clean, potable water directly from the ambient air.
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
              gap: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2,
              p: 2.5,
              backdropFilter: 'blur(10px)',
            }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Daily Capacity</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>500-800 L</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Efficiency</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>85-92%</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Energy Source</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Solar + Grid</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Serving</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>~2,500 people</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      </motion.div>
      
      {/* Data Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2.5, md: 4 }, 
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: '#1e88e5',
            mb: 4,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          📊 Performance Analytics
        </Typography>
        
        {/* Filter Controls */}
        <Box sx={{ 
          background: 'rgba(248, 249, 250, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          border: '1px solid rgba(222, 226, 230, 0.6)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
        }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              fontSize: '1.25rem', 
              fontWeight: 700,
              color: '#1e88e5',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box sx={{ 
              backgroundColor: '#1e88e5',
              borderRadius: '50%',
              p: 0.75,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Tune sx={{ fontSize: '1.25rem', color: 'white' }} />
            </Box>
            Configure Data View
          </Typography>
          
          <Box 
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            {/* Date Period Button */}
            {/* Date Period Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ flex: 1, minWidth: '280px' }}
            >
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<CalendarMonth sx={{ fontSize: '1.5rem' }} />}
                onClick={() => {
                  setTempStartDate(startDate);
                  setTempEndDate(endDate);
                  setDateDialogOpen(true);
                }}
                sx={{
                  px: 4,
                  py: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid #1e88e5',
                  color: '#1e88e5',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  borderRadius: 2.5,
                  boxShadow: '0 4px 12px rgba(30, 136, 229, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
                    color: 'white',
                    boxShadow: '0 6px 20px rgba(30, 136, 229, 0.3)',
                    border: '2px solid #1565c0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>
                    DATE PERIOD
                  </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {startDate && endDate 
                    ? `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`
                    : 'Select Date Period'}
                </Typography>
                </Box>
              </Button>
            </motion.div>

            {/* Parameters Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ flex: 1, minWidth: '320px' }}
            >
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Tune sx={{ fontSize: '1.5rem' }} />}
                onClick={() => {
                  setTempUnit(selectedUnit);
                  setTempCategory(selectedCategory);
                  setTempParameters(selectedParameters);
                  setParamDialogOpen(true);
                }}
                sx={{
                  px: 4,
                  py: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid #1e88e5',
                  color: '#1e88e5',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  borderRadius: 2.5,
                  boxShadow: '0 4px 12px rgba(30, 136, 229, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
                    color: 'white',
                    boxShadow: '0 6px 20px rgba(30, 136, 229, 0.3)',
                    border: '2px solid #1565c0',
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>
                    PARAMETERS
                  </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', textAlign: 'left' }}>
                  {selectedUnit && selectedCategory && selectedParameters.length > 0
                    ? (station?.units && station.units.length > 0 
                        ? `${selectedUnit} • ${selectedCategory} • ${selectedParameters.join(', ')}`
                        : `${selectedCategory} • ${selectedParameters.join(', ')}`)
                    : 'Select Parameters'}
                </Typography>
                </Box>
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Paper>
      </motion.div>
      
      {startDate && endDate && selectedParameters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FeaturePlot
            data={chartData}
            feature={`${selectedCategory} - ${selectedParameters.join(', ')}` as FeatureType}
            startDate={format(startDate, 'yyyy-MM-dd')}
            endDate={format(endDate, 'yyyy-MM-dd')}
          />
          
          <CSVExport
            data={filteredData}
            feature={`${selectedCategory} - ${selectedParameters.join(', ')}` as FeatureType}
            stationName={station.name}
            dateRange={dateRangeString}
          />
        </motion.div>
      )}

      {/* Date Period Dialog */}
      <AnimatePresence>
        {dateDialogOpen && (
          <Dialog 
            open={dateDialogOpen} 
            onClose={() => setDateDialogOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
              }
            }}
            TransitionProps={{
              timeout: 300,
            }}
          >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.75rem',
          background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
          color: 'white',
          py: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Box sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarMonth sx={{ fontSize: '1.75rem' }} />
          </Box>
          Select Date Period
        </DialogTitle>
        <DialogContent sx={{ pt: 5, pb: 4, px: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                START DATE
              </Typography>
              <DatePicker
                label="Start Date"
                value={tempStartDate}
                onChange={(newValue) => setTempStartDate(newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: 'medium',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#e9ecef'
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white'
                        }
                      }
                    }
                  } 
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                END DATE
              </Typography>
              <DatePicker
                label="End Date"
                value={tempEndDate}
                onChange={(newValue) => setTempEndDate(newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: 'medium',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#e9ecef'
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white'
                        }
                      }
                    }
                  } 
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          px: 4,
          backgroundColor: '#f8f9fa',
          gap: 2
        }}>
          <Button 
            onClick={() => setDateDialogOpen(false)}
            variant="outlined"
            size="large"
            sx={{ 
              color: 'text.secondary',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDateApply}
            variant="contained"
            size="large"
            sx={{ 
              background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
              fontWeight: 600,
              px: 5,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(30, 136, 229, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                boxShadow: '0 6px 16px rgba(30, 136, 229, 0.4)',
              }
            }}
          >
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
        )}
      </AnimatePresence>

      {/* Parameters Dialog */}
      <AnimatePresence>
        {paramDialogOpen && (
          <Dialog 
            open={paramDialogOpen} 
            onClose={() => setParamDialogOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
              }
            }}
            TransitionProps={{
              timeout: 300,
            }}
          >
            <DialogTitle sx={{ 
              fontWeight: 700, 
              fontSize: '1.75rem',
              background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
              color: 'white',
          py: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Box sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Tune sx={{ fontSize: '1.75rem' }} />
          </Box>
          Configure Parameters
        </DialogTitle>
        <DialogContent sx={{ pt: 5, pb: 4, px: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Unit Selector - Only show if station has units */}
            {station?.units && station.units.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                  UNIT
                </Typography>
                <FormControl fullWidth size="medium">
                  <InputLabel>Select Unit</InputLabel>
                  <Select
                    value={tempUnit}
                    label="Select Unit"
                    onChange={(e) => setTempUnit(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          mt: 1,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          borderRadius: 2,
                        }
                      }
                    }}
                    sx={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#e9ecef'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    {station.units.map((unit) => (
                      <MenuItem 
                        key={unit} 
                        value={unit}
                        sx={{
                          py: 1.5,
                          px: 2.5,
                          fontSize: '1rem',
                          '&:hover': {
                            backgroundColor: '#e3f2fd'
                          },
                          '&.Mui-selected': {
                            backgroundColor: '#bbdefb',
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: '#90caf9'
                            }
                          }
                        }}
                      >
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                CATEGORY
              </Typography>
              <FormControl fullWidth size="medium">
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={tempCategory}
                  label="Select Category"
                  onChange={(e) => handleTempCategoryChange(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        mt: 1,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                      }
                    }
                  }}
                  sx={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#e9ecef'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white'
                    }
                  }}
                >
                  {Object.keys(parameterCategories).map((category) => (
                    <MenuItem 
                      key={category} 
                      value={category}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: '#e3f2fd'
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#bbdefb',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: '#90caf9'
                          }
                        }
                      }}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                PARAMETERS (Select up to 2)
              </Typography>
              <Paper 
                sx={{ 
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  maxHeight: 250,
                  overflow: 'auto'
                }}
              >
                <FormGroup>
                  {tempCategory && parameterCategories[tempCategory as keyof typeof parameterCategories]?.map((param) => (
                    <FormControlLabel
                      key={param}
                      control={
                        <Checkbox
                          checked={tempParameters.includes(param)}
                          onChange={() => handleParameterToggle(param)}
                          disabled={!tempParameters.includes(param) && tempParameters.length >= 2}
                          sx={{
                            color: '#1e88e5',
                            '&.Mui-checked': {
                              color: '#1e88e5',
                            }
                          }}
                        />
                      }
                      label={param}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '1rem',
                          fontWeight: tempParameters.includes(param) ? 600 : 400,
                        }
                      }}
                    />
                  ))}
                </FormGroup>
                {!tempCategory && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    Please select a category first
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3,
          px: 4, 
          backgroundColor: '#f8f9fa',
          gap: 2
        }}>
          <Button 
            onClick={() => setParamDialogOpen(false)}
            variant="outlined"
            size="large"
            sx={{ 
              color: 'text.secondary',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleParamApply}
            variant="contained"
            size="large"
            sx={{ 
              background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
              fontWeight: 600,
              px: 5,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(30, 136, 229, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                boxShadow: '0 6px 16px rgba(30, 136, 229, 0.4)',
              }
            }}
          >
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
}