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
import { regexUrl } from '~/constants/regex'
import { isEmpty } from '~/utils/commonFunction'

const WorkPlaceModal = ({ open, handleClose, userId, organizationId, workPlace, setWorkPlace }) => {
    const { updateWorkplace } = useProfile()
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [organization, setOrganization] = useState({
        organizationName: workPlace ? workPlace.organizationName : '',
        organizationDescription: workPlace ? workPlace.organizationDescription : '',
        organizationWebsite: workPlace ? workPlace.organizationWebsite : '',
        organizationPhoneNumber: workPlace ? workPlace.organizationPhoneNumber : '',
        grid: workPlace ? workPlace.grid : '',
    })

    const handleOrganization = (event) => {
        const { value, name } = event.target
        setOrganization((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const { organizationName, organizationDescription, organizationWebsite, organizationPhoneNumber, grid } =
        organization

    const [error, setError] = useState({
        organizationName: false,
        organizationPhoneNumber: false,
        organizationWebsite: false,
    })

    const [messageError, setMessageError] = useState({
        organizationName: '',
        organizationPhoneNumber: '',
        organizationWebsite: '',
    })

    const handleSubmit = () => {
        const isOrganizationName = !isEmpty(organizationName)
        const isOrganizationPhoneNumber = !isEmpty(organizationPhoneNumber)
        const isWebsiteUrl = isEmpty(organizationWebsite) ? true : regexUrl.test(organizationWebsite)
        const isValid = isOrganizationName && isOrganizationPhoneNumber && isWebsiteUrl
        if (!isValid) {
            setError({
                organizationName: !isOrganizationName,
                organizationPhoneNumber: !isOrganizationPhoneNumber,
                organizationWebsite: !isWebsiteUrl,
            })
            setMessageError({
                organizationName: !isOrganizationName ? 'Organization name must not be empty' : '',
                organizationPhoneNumber: !isOrganizationPhoneNumber ? 'Organization Number must not be empty' : '',
                organizationWebsite: !isWebsiteUrl ? 'Invalid URL' : '',
            })
        } else {
            setLoading(true)
            const workplaceData = {
                organizationId: organizationId ?? uuid(),
                organizationName,
                organizationDescription,
                organizationWebsite,
                organizationPhoneNumber,
                grid,
            }
            updateWorkplace(userId, workplaceData)
                .then(() => {
                    setWorkPlace(cloneDeep(workplaceData))
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
                    Current Workplace
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
                    <InputLayout boxStyle={{ mb: 2 }} label="Organization Name">
                        <TextField
                            onChange={handleOrganization}
                            value={organizationName}
                            inputProps={{ maxLength: 64 }}
                            name="organizationName"
                            size="small"
                            fullWidth
                            error={error.organizationName}
                            helperText={error.organizationName ? messageError.organizationName : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Organization Phone Number">
                        <TextField
                            size="small"
                            fullWidth
                            value={organizationPhoneNumber}
                            name="organizationPhoneNumber"
                            onChange={handleOrganization}
                            error={error.organizationPhoneNumber}
                            helperText={error.organizationPhoneNumber ? messageError.organizationPhoneNumber : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Organization Description" isRequired={false}>
                        <TextField
                            onChange={handleOrganization}
                            name="organizationDescription"
                            size="small"
                            fullWidth
                            multiline
                            minRows={5}
                            maxRows={9}
                            value={organizationDescription}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Organization Website" isRequired={false}>
                        <TextField
                            size="small"
                            fullWidth
                            value={organizationWebsite}
                            name="organizationWebsite"
                            onChange={handleOrganization}
                            error={error.organizationWebsite}
                            helperText={error.organizationWebsite ? messageError.organizationWebsite : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="GRID" isRequired={false}>
                        <TextField size="small" fullWidth value={grid} onChange={handleOrganization} name="grid" />
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

export default WorkPlaceModal
