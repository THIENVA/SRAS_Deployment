import { Edit } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const CardLayout = ({ title, children, nameModal }) => {
    return (
        <Box mt={4} sx={{ boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)', p: 4, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight={500} sx={{ color: AppStyles.colors['#333333'] }}>
                    {title}
                </Typography>
                <Tooltip title={nameModal}>
                    <IconButton>
                        <Edit sx={{ color: AppStyles.colors['#004DFF'] }} />
                    </IconButton>
                </Tooltip>
            </Box>
            {children}
        </Box>
    )
}

export default CardLayout
