import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SectionLayout = ({ title, children, style }) => {
    return (
        <Box mt={3} sx={{ ...style }}>
            <Typography
                sx={{
                    py: 1,
                    px: 1.5,
                    width: 'fit-content',
                    backgroundColor: AppStyles.colors['#F5F5F5'],
                    fontWeight: 600,
                    textTransform: 'uppercase',
                }}
            >
                {title}
            </Typography>
            <Box maxWidth={1200} sx={{ mx: 'auto', pt: 2 }}>
                {children}
            </Box>
        </Box>
    )
}

export default SectionLayout
