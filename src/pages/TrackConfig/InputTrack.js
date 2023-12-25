import { useEffect, useState } from 'react'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField } from '@mui/material'

const InputTrack = ({
    track,
    modifyTrackHandler,
    cancelEditingHandler,
    modifyLoading,
    messageError,
    error,
    setMessageError,
    setError,
}) => {
    const { name } = track
    const [trackText, setTrackText] = useState(name)

    const textChangeHandler = (event) => {
        setTrackText(event.target.value)
        setMessageError('')
        setError(false)
    }

    useEffect(() => {
        setTrackText(name)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])
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
                error={error}
                helperText={error ? messageError : ''}
            />
            <Box mb={error ? 3 : 0}>
                <LoadingButton
                    startIcon={<Save />}
                    loadingPosition="start"
                    loading={modifyLoading}
                    disabled={modifyLoading}
                    variant="contained"
                    sx={{ mx: 1.5 }}
                    onClick={() => modifyTrackHandler(trackText)}
                >
                    Save
                </LoadingButton>
                <Button variant="contained" color="error" onClick={cancelEditingHandler}>
                    Cancel
                </Button>
            </Box>
        </Box>
    )
}

export default InputTrack
