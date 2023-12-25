import { useState } from 'react'

import { Edit } from '@mui/icons-material'
import { Box, Collapse, IconButton, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const CollapseLayout = ({
    id,
    title,
    children,
    startDate,
    endDate,
    degreeAbbreviation,
    degree,
    position,
    tabName,
    handleOpenEdit,
}) => {
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
                <Typography variant="h6" fontWeight={500} sx={{ color: AppStyles.colors['#333'] }}>
                    {title}
                </Typography>
                <IconButton onClick={() => handleOpenEdit(id)}>
                    <Edit sx={{ color: AppStyles.colors['#004DFF'] }} />
                </IconButton>
            </Box>
            <Box px={3} py={2} sx={{ borderBottom: '0.5px solid rgba(51, 51, 51, 0.6)' }}>
                <Box display="flex" justifyContent="space-between">
                    {degreeAbbreviation && degree && (
                        <Typography variant="body2">
                            {startDate} to {endDate} | {degreeAbbreviation} ({degree})
                        </Typography>
                    )}
                    {position && (
                        <Typography variant="body2">
                            {startDate} to {endDate} | {position}
                        </Typography>
                    )}
                    <Typography
                        sx={{ color: AppStyles.colors['#004DFF'], cursor: 'pointer', ml: 1 }}
                        onClick={handleClick}
                    >
                        {open ? 'Show less detail' : 'Show more detail'}
                    </Typography>
                </Box>
                <Typography variant="body2">{tabName}</Typography>
            </Box>
            <Box sx={{ height: '100%' }}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {children}
                </Collapse>
            </Box>
        </Box>
    )
}

export default CollapseLayout
