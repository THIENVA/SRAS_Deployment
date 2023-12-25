import { useState } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import TransitionCompo from '~/components/TransitionCompo'

import InputLayout from './InputLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { isEmpty } from '~/utils/commonFunction'

const CreateResearchModal = ({ open, handleClose, userId, researches, setResearches }) => {
    const { updateResearch } = useProfile()
    const [loading, setLoading] = useState(false)
    const showSnackbar = useSnackbar()
    const [research, setScholarship] = useState({
        name: '',
    })
    const [error, setError] = useState({
        name: false,
    })
    const [messageError, setMessageError] = useState({
        name: '',
    })

    const { name } = research

    const handleScholarship = (event) => {
        const { value, name } = event.target
        setScholarship((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleSubmit = () => {
        const isName = !isEmpty(name)
        if (!isName) {
            setError({ name: true })
            setMessageError({ name: !isName ? 'Name must not be empty' : '' })
        } else {
            setLoading(true)
            const researchData = {
                researchDirectionId: uuid(),
                researchDirectionName: name,
            }
            updateResearch(userId, [...researches, { ...researchData }])
                .then(() => {
                    const formatResearch = cloneDeep(researchData)
                    const cloneResearches = cloneDeep(researches)
                    cloneResearches.push(formatResearch)
                    setResearches(cloneResearches)
                    handleClose()
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <Dialog
            sx={{ backdropFilter: 'blur(4px)' }}
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={TransitionCompo}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle id="alert-dialog-title">
                    Create Research
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <InputLayout boxStyle={{ mb: 2 }} label="Name">
                        <TextField
                            onChange={handleScholarship}
                            value={name}
                            inputProps={{ maxLength: 64 }}
                            name="name"
                            size="small"
                            fullWidth
                            error={error.name}
                            helperText={error.name ? messageError.name : ''}
                        />
                    </InputLayout>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={loading}
                        onClick={handleSubmit}
                        loadingPosition="start"
                        startIcon={<Save />}
                        variant="contained"
                    >
                        Save Change
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default CreateResearchModal
