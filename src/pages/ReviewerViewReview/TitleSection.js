import { Box } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TitleSection = ({ children }) => {
    return (
        <Box
            p={1}
            my={2}
            fontWeight={500}
            sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: AppStyles.colors['#F7F7F7'],
                boxShadow: 'rgba(17, 17, 26, 0.1) 0px 2px 0px',
            }}
        >
            {children}
        </Box>
    )
}

export default TitleSection
