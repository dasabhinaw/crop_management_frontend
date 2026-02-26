import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const Loading = () => {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ paddingTop:'100px' }}>
            <CircularProgress size={55} color='secondary' />
        </Box>
        
    )
}

export default Loading