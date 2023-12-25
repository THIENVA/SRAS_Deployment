import { Box, Typography } from '@mui/material'

import femaleIcon from '~/assets/images/femaleIcon.png'
import maleIcon from '~/assets/images/maleIcon.png'

const AvatarInfo = ({ gender, academicFunction, currentDegree, current, academic }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box
                component="img"
                alt="avatar"
                src={gender === 'male' ? maleIcon : femaleIcon}
                sx={{ width: 150, height: 150, borderRadius: '50%' }}
                referrerPolicy="no-referrer"
            />
            <Typography mt={1} align="center" sx={{ color: '#7b8084' }} mb={0.5}>
                {academicFunction} ({academic})
            </Typography>
            <Typography fontWeight={500} align="center">
                {currentDegree} ({current})
            </Typography>
        </Box>
    )
}

export default AvatarInfo
