import { Box, TextField, Typography } from '@mui/material'

const SubmissionInstruction = ({ submissionInstruction, setSubmissionInstruction }) => {
    const handleInstructionChange = (event) => {
        setSubmissionInstruction(event.target.value)
    }
    return (
        <Box mt={1}>
            <Typography sx={{ fontSize: 20 }}>Welcome Message & Instructions</Typography>
            <TextField
                multiline
                rows={3}
                variant="outlined"
                fullWidth
                value={submissionInstruction}
                onChange={handleInstructionChange}
            />
        </Box>
    )
}

export default SubmissionInstruction
