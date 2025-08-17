import React from 'react';
import Chip from '@mui/material/Chip';

const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'reversed':
        return { label: 'Reversed', color: 'success' };
      case 'under_process':
        return { label: 'Under Process', color: 'warning' };
      case 'rejected':
        return { label: 'Rejected', color: 'error' };
      default:
        return { label: status || 'Unknown', color: 'default' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip 
      label={config.label} 
      color={config.color} 
      size="small" 
      variant="outlined"
      sx={{ 
        fontWeight: 600,
        textTransform: 'capitalize',
        borderRadius: 1,
        borderWidth: 1.5,
      }}
    />
  );
};

export default StatusChip;