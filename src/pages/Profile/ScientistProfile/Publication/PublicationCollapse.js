import { useState } from 'react'

import { Edit } from '@mui/icons-material'
import { Box, Collapse, IconButton, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const PublicationCollapse = ({
    title,
    children,
    date,
    workTypeName,
    publisher,
    tabName,
    doiTitle,
    doiLink,
    contributors,
    id,
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
                <Box display="flex" alignItems="baseline" justifyContent="space-between">
                    <Box>
                        <Typography gutterBottom variant="body2">
                            publisher: {publisher}
                        </Typography>
                        <Typography gutterBottom variant="body2">
                            {date} | {workTypeName}
                        </Typography>
                        <Box mb={1} display="flex" alignItems="baseline">
                            <Typography variant="body2">DOI: </Typography>
                            <Box component="a" href={doiLink} target="blank" ml={0.5}>
                                {doiTitle}
                            </Box>
                        </Box>
                        <Typography gutterBottom variant="body2">
                            Contributors: {contributors.map((contributor) => `${contributor}, `)}
                        </Typography>
                    </Box>
                    <Typography
                        sx={{ color: AppStyles.colors['#004DFF'], cursor: 'pointer', ml: 1 }}
                        onClick={handleClick}
                    >
                        Show less detail
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

export default PublicationCollapse
