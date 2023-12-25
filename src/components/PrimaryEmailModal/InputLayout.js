import { Box, Typography } from '@mui/material'

const InputLayout = ({ label, children, boxStyle }) => {
    return (
        <Box sx={{ ...boxStyle }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mr: 2 }}>
                {label}
            </Typography>
            {children}
        </Box>
    )
}

export default InputLayout
