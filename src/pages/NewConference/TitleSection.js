import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TitleSection = ({ children, required = true }) => {
    return (
        <Box
            p={1}
            my={2}
            fontWeight={500}
            sx={{
                backgroundColor: AppStyles.colors['#F5F5F5'],
            }}
        >
            <Typography sx={{ color: AppStyles.colors['#555'], textTransform: 'uppercase' }}>
                {children} {required && <span style={{ color: 'red' }}>*</span>}{' '}
            </Typography>
        </Box>
    )
}

export default TitleSection
