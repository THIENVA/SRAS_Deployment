import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SectionLayout = ({ title, children, style, boxStyle }) => {
    return (
        <Box mt={3} sx={{ ...style }}>
            <Typography
                sx={{
                    textTransform: 'capitalize',
                    py: 1,
                    px: 1.5,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: AppStyles.colors['#F7F7F7'],
                    fontWeight: 'bold',
                }}
            >
                {title}
            </Typography>
            <Box maxWidth={1200} sx={{ mx: 'auto', pt: 2, ...boxStyle }}>
                {children}
            </Box>
        </Box>
    )
}

export default SectionLayout
