import { Alert, AlertTitle, Box } from '@mui/material'
import React from 'react'

const Error = ({ errorMsg}) => {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Alert severity={"error"}>
                <AlertTitle>{errorMsg}</AlertTitle>
            </Alert>
        </Box>
    )
}

export default Error