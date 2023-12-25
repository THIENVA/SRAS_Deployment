import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SectionLayout = ({ title, children, style, titleStyle }) => {
    return (
        <Box mt={3} sx={{ ...style }}>
            <Typography
                sx={{
                    width: 'fit-content',
                    textTransform: 'capitalize',
                    py: 1,
                    px: 1.5,
                    backgroundColor: AppStyles.colors['#F5F5F5'],
                    ...titleStyle,
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
