import { Box, Typography } from '@mui/material'

const Award = ({ name, year }) => {
    return (
        <Box pb={2} mt={2} sx={{ borderBottom: '0.5px solid rgba(0, 0, 0, 0.2)' }}>
            <Typography variant="500" fontWeight={500}>
                {name}
            </Typography>
            <Typography sx={{ color: 'rgba(51, 51, 51, 0.7)' }} variant="body1">
                issued {year}
            </Typography>
        </Box>
    )
}

export default Award
