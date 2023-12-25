import { Box, Typography } from '@mui/material'

const CreateFormLayout = ({ children, title, subTitle }) => {
    return (
        <Box mx="auto" pb={4} width={1200}>
            <Typography sx={{ fontSize: 28, fontWeight: 600 }}>{title}</Typography>
            <Typography sx={{ fontSize: 18 }}>{subTitle}</Typography>
            {children}
        </Box>
    )
}

export default CreateFormLayout
