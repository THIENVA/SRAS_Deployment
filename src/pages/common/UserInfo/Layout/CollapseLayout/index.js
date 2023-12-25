import { useState } from 'react'

import { Edit } from '@mui/icons-material'
import { Box, Collapse, IconButton, Tooltip, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const CollapseLayout = ({ title, nameModal, children }) => {
    const [open, setOpen] = useState(true)

    const handleClick = () => {
        setOpen(!open)
    }
    return (
        <Box mt={4} sx={{ border: '0.5px solid rgba(51, 51, 51, 0.6)', borderRadius: 3, overflow: 'hidden' }}>
            <Box
                py={1}
                px={3}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ backgroundColor: AppStyles.colors['#E0E0E0'], borderBottom: '0.5px solid rgba(51, 51, 51, 0.6)' }}
            >
                <Typography variant="h6" fontWeig t={500} sx={{ color: AppStyles.colors['#000000'] }}>
                    {title}
                </Typography>
                <Tooltip title={nameModal}>
                    <IconButton>
                        <Edit sx={{ color: AppStyles.colors['#004DFF'] }} />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box px={3} py={2} sx={{ borderBottom: '0.5px solid rgba(51, 51, 51, 0.6)' }}>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">
                        2019-07-13 to 2021-04-28 | M.Eng. (Automation and Control Engineering)
                    </Typography>
                    <Typography sx={{ color: AppStyles.colors['#004DFF'], cursor: 'pointer' }} onClick={handleClick}>
                        Show less detail
                    </Typography>
                </Box>
                <Typography variant="body1">Education</Typography>
            </Box>
            <Box sx={{ height: '100%' }}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {children}
                </Collapse>
            </Box>
            <Box px={3} py={2} sx={{ borderBottom: '0.5px solid rgba(51, 51, 51, 0.6)' }}>
                <Typography variant="body1">
                    <strong>Source</strong>: Nguyen Dang Truong Anh
                </Typography>
            </Box>
        </Box>
    )
}

export default CollapseLayout
