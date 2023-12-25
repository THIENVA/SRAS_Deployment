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
            }}
        >
            {children}
        </Box>
    )
}

export default TitleSection
