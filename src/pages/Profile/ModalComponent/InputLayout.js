import { Box, Typography } from '@mui/material'

const InputLayout = ({ label, children, boxStyle, isRequired = true }) => {
    return (
        <Box sx={{ ...boxStyle }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mr: 2 }}>
                {label}{' '}
                {isRequired && (
                    <span color="red" style={{ verticalAlign: 'top', color: 'red' }}>
                        *
                    </span>
                )}
            </Typography>
            {children}
        </Box>
    )
}

export default InputLayout
