import { Edit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const CardLayout = ({ title, children, handleOpenModal, canEdit = true }) => {
    return (
        <Box mt={3} sx={{ boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)', p: 3, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={500} sx={{ color: AppStyles.colors['#333333'] }}>
                    {title}
                </Typography>
                {canEdit && (
                    <IconButton onClick={handleOpenModal} size="small">
                        <Edit fontSize="small" sx={{ color: AppStyles.colors['#004DFF'] }} />
                    </IconButton>
                )}
            </Box>
            {children}
        </Box>
    )
}

export default CardLayout
