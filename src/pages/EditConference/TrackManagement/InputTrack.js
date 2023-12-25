import { useEffect, useState } from 'react'

import { Box, Button, TextField } from '@mui/material'

const InputTrack = ({ track, modifyTrackHandler, cancelEditingHandler }) => {
    const { text } = track
    const [trackText, setTrackText] = useState(text)

    const textChangeHandler = (event) => {
        setTrackText(event.target.value)
    }

    useEffect(() => {
        setTrackText(text)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text])
    return (
        <Box display="flex" alignItems="center" my={2}>
            <TextField
                size="small"
                placeholder="Track Name"
                variant="outlined"
                fullWidth
                sx={{ maxWidth: 300 }}
                value={trackText}
                onChange={textChangeHandler}
            />
            <Button variant="contained" sx={{ mx: 1.5 }} onClick={() => modifyTrackHandler(trackText)}>
                Save
            </Button>
            <Button variant="contained" color="error" onClick={cancelEditingHandler}>
                Cancel
            </Button>
        </Box>
    )
}

export default InputTrack
