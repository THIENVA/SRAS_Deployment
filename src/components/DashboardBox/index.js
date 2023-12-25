import React from 'react'

import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const DashboardBox = ({ header, children, contentStyle, outerContentStyle, boxStyle }) => {
    return (
        <Box
            sx={{
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                ...boxStyle,
            }}
            borderRadius={2}
        >
            <Box sx={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.08)' }}>
                <Box py={2} px={3}>
                    <Typography sx={{ fontSize: 16, color: AppStyles.colors['#002b5d'], fontWeight: 600 }}>
                        {header}
                    </Typography>
                </Box>
            </Box>
            <Box pb={2} sx={{ ...outerContentStyle }}>
                <Box py={2} px={3} sx={{ ...contentStyle }}>
                    {children}
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardBox
