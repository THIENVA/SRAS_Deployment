import { Box, Typography } from '@mui/material'

import AvatarExample from '~/assets/images/Ava-example.png'
import { AppStyles } from '~/constants/colors'

const AvatarInfo = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box
                component="img"
                alt="avatar"
                src={AvatarExample}
                sx={{ width: 150, height: 150, borderRadius: '50%' }}
                referrerPolicy="no-referrer"
            />
            <Typography align="center" sx={{ color: AppStyles.colors['#333333'] }} mt={1}>
                Associate professor
            </Typography>
            <Typography fontWeight={500} align="center" mt={1}>
                Ph.D
            </Typography>
        </Box>
    )
}

export default AvatarInfo
