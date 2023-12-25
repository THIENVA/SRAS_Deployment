import { AddCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TopicBlock = ({ title, num = 0, handleOpenModal }) => {
    return (
        <Box
            py={1}
            px={3}
            mt={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ backgroundColor: AppStyles.colors['#004DFF'], borderRadius: 3 }}
        >
            <Typography variant="h6" fontWeight={500} sx={{ color: AppStyles.colors['#FFFFFF'] }}>
                {title} ({num})
            </Typography>
            <Tooltip onClick={handleOpenModal}>
                <IconButton>
                    <AddCircleOutline sx={{ color: AppStyles.colors['#FFFFFF'] }} />
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default TopicBlock
