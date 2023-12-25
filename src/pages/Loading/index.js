import { Box, CircularProgress } from '@mui/material'

const Loading = ({ height = '90vh' }) => {
    return (
        <Box height={height}>
            <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                <CircularProgress thickness={4} />
            </Box>
        </Box>
    )
}

export default Loading
