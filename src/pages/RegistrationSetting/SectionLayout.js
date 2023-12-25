import { Add } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SectionLayout = ({ title, children, style, onClick }) => {
    return (
        <Box mt={3} sx={{ ...style }}>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
            >
                <Typography
                    sx={{
                        textTransform: 'capitalize',
                        py: 1,
                        px: 1.5,
                        color: AppStyles.colors['#F7F7F7'],
                    }}
                >
                    {title}
                </Typography>
                {onClick && (
                    <Button startIcon={<Add />} onClick={onClick} variant="outlined" sx={{ color: 'white' }}>
                        New Option
                    </Button>
                )}
            </Box>
            <Box maxWidth={1200} sx={{ mx: 'auto', pt: 2 }}>
                {children}
            </Box>
        </Box>
    )
}

export default SectionLayout
