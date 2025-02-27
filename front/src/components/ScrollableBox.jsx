import { Box } from '@mui/material'
import React from 'react'

export const ScrollableBox = ({children}) => {
  return (
    <Box
      sx={{
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "4px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#e0e0e0",
          borderRadius: "6px",
          height: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#673ab7",
          borderRadius: "6px",
          transition: "background 0.3s ease-in-out",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#512da8",
        },
      }}
    >
      {children}
    </Box>
  );
}
