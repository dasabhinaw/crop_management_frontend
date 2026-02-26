import React from 'react'
import { Paper } from '@mui/material'
import { styled } from '@mui/system'

const MuiPaper = ({children}) => {
    return (
        <Paper sx={{p:{xs:2,md:3}}}>{children}</Paper>
    )
}

export default MuiPaper