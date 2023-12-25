import { Box } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TitleSection = ({ children }) => {
    return (
        <Box
            p={1}
            my={2}
            fontWeight={500}
            sx={{
                backgroundColor: AppStyles.colors['#F5F5F5'],
                color: AppStyles.colors['#555'],
            }}
        >
            {children}
        </Box>
    )
}

export default TitleSection
