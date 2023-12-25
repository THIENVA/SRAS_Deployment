import { Edit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const UserBlockInfo = ({ isClickable = false, title, content, style, handleOpenModal, canEditing }) => {
    return (
        <Box sx={{ border: `1px solid ${AppStyles.colors['#004DFF']}`, borderRadius: 3, overflow: 'hidden', ...style }}>
            <Box
                p={1.5}
                sx={{ borderBottom: `1px solid ${AppStyles.colors['#004DFF']}` }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography fontWeight={500} sx={{ borderBottom: `1px solid ${AppStyles.colors['#004DFF']}` }}>
                    {title}
                </Typography>
                {canEditing && (
                    <IconButton onClick={handleOpenModal}>
                        <Edit sx={{ color: AppStyles.colors['#004DFF'] }} />
                    </IconButton>
                )}
            </Box>
            <Box sx={{ backgroundColor: AppStyles.colors['#FFFFFF'], p: 1.5 }}>
                {isClickable ? (
                    <Typography
                        sx={{ color: AppStyles.colors['#004DFF'], cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {content}
                    </Typography>
                ) : (
                    <Typography variant="body2">{content}</Typography>
                )}
            </Box>
        </Box>
    )
}

export default UserBlockInfo
