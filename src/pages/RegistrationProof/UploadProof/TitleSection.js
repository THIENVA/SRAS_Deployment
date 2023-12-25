import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TitleSection = ({ children, required = true }) => {
    return (
        <Box
            my={2}
            p={1}
            px={2}
            sx={{
                backgroundColor: AppStyles.colors['#F5F5F5'],
            }}
        >
            <Typography sx={{ fontWeight: 'bold', color: AppStyles.colors['#555'], textTransform: 'uppercase' }}>
                {children} {required && <span style={{ color: 'red' }}>*</span>}{' '}
            </Typography>
        </Box>
    )
}

export default TitleSection
