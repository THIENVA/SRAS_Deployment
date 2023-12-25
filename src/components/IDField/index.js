import React, { useState } from 'react'

import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const IDField = ({ id, style, showButton, onClick, boxStyle }) => {
    const [showFullId, setShowFullId] = useState(false)

    const shortId = `${id?.substring(0, 4)}-${id?.substring(id?.length - 5)}`

    const toggleDisplay = () => {
        setShowFullId(!showFullId)
    }
    return (
        <Box display={'flex'} alignItems={'center'} sx={{ ...boxStyle }}>
            <Typography sx={{ color: AppStyles.colors['#495057'], ...style }} onClick={onClick}>
                {showFullId ? id : shortId}
            </Typography>
            {showButton && (
                <IconButton color="primary" sx={{ ml: 1, height: 24 }} onClick={toggleDisplay} size="small">
                    {showFullId ? (
                        <VisibilityOffOutlined fontSize="inherit" />
                    ) : (
                        <VisibilityOutlined fontSize="inherit" />
                    )}
                </IconButton>
            )}
        </Box>
    )
}

export default IDField
