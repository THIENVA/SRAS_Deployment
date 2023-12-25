import React, { useEffect, useState } from 'react'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Autocomplete, Box, Button, FormHelperText, TextField } from '@mui/material'

import { subjectAreaRecommendation } from '~/mock/SubjectAreas.'

const InputSubjectArea = ({
    subjectArea,
    modifySubjectAreaHandler,
    cancelEditingHandler,
    modifyLoading,
    messageError,
    error,
    setMessageError,
    setError,
}) => {
    const { name } = subjectArea
    const [subjectAreaText, setSubjectAreaText] = useState(name)

    const textChangeHandler = (value) => {
        setSubjectAreaText(value)
        setMessageError('')
        setError(false)
    }

    useEffect(() => {
        setSubjectAreaText(name)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])

    return (
        <React.Fragment>
            <Box display="flex" alignItems="center" mt={2}>
                <Autocomplete
                    inputValue={subjectAreaText}
                    onInputChange={(_, newInputValue) => {
                        textChangeHandler(newInputValue)
                    }}
                    size="small"
                    options={subjectAreaRecommendation}
                    sx={{ maxWidth: 500 }}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Subject Area" />}
                    clearOnBlur={false}
                />
                <LoadingButton
                    startIcon={<Save />}
                    loadingPosition="start"
                    loading={modifyLoading}
                    disabled={modifyLoading}
                    variant="contained"
                    sx={{ mx: 1.5 }}
                    onClick={() => modifySubjectAreaHandler(subjectAreaText)}
                >
                    Save
                </LoadingButton>
                <Button variant="contained" color="error" onClick={cancelEditingHandler}>
                    Cancel
                </Button>
            </Box>
            {error && <FormHelperText error={error}>{messageError}</FormHelperText>}
        </React.Fragment>
    )
}

export default InputSubjectArea
