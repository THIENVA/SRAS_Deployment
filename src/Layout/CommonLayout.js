import React from 'react'

import { Box } from '@mui/material'

const CommonLayout = ({ children }) => {
    return (
        <React.Fragment>
            <Box minHeight="87.5vh" sx={{ m: '0 auto', pt: 15, pb: 4 }}>
                {children}
            </Box>
        </React.Fragment>
    )
}

export default CommonLayout
