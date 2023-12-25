import { memo } from 'react'

import { Box, TextField, Typography } from '@mui/material'

const RevisionInstruction = ({ revisionInstruction, setRevisionInstruction }) => {
    const handleInstructionChange = (event) => {
        setRevisionInstruction(event.target.value)
    }
    return (
        <Box m1={2}>
            <Typography sx={{ fontSize: 20 }}>Revision Instruction</Typography>
            <TextField
                multiline
                rows={3}
                variant="outlined"
                fullWidth
                value={revisionInstruction}
                onChange={handleInstructionChange}
            />
        </Box>
    )
}

export default memo(RevisionInstruction)
