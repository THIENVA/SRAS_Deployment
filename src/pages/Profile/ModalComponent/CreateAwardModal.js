import { useState } from 'react'

import { enGB } from 'date-fns/locale'
import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import TransitionCompo from '~/components/TransitionCompo'

import InputLayout from './InputLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { isEmpty } from '~/utils/commonFunction'

const CreateAwardModal = ({ open, handleClose, userId, awards, setAwards }) => {
    const { updateAward } = useProfile()
    const [loading, setLoading] = useState(false)
    const showSnackbar = useSnackbar()
    const [scholarship, setScholarship] = useState({
        name: '',
        description: '',
        issuer: '',
    })
    const [error, setError] = useState({
        name: false,
    })
    const [messageError, setMessageError] = useState({
        name: '',
    })
    const [issuedYear, setIssuedYear] = useState(null)

    const { name, description, issuer } = scholarship

    const handleScholarship = (event) => {
        const { value, name } = event.target
        setScholarship((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleIssueYear = (value) => {
        setIssuedYear(value)
    }

    const handleSubmit = () => {
        const isName = !isEmpty(name)
        if (!isName) {
            setError({ name: true })
            setMessageError({ name: !isName ? 'Name must not be empty' : '' })
        } else {
            setLoading(true)
            const awardData = {
                id: uuid(),
                name,
                description,
                issuer,
                issuedYear: issuedYear ? issuedYear.getFullYear() : null,
            }
            updateAward(userId, [...awards, { ...awardData }])
                .then(() => {
                    const formatAward = cloneDeep(awardData)
                    const cloneAwards = cloneDeep(awards)
                    cloneAwards.push(formatAward)
                    setAwards(cloneAwards)
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
                    Create Award
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
                    <InputLayout isRequired={false} boxStyle={{ mb: 2 }} label="Description">
                        <TextField
                            onChange={handleScholarship}
                            value={description}
                            multiline
                            minRows={5}
                            maxRows={9}
                            name="description"
                            size="small"
                            fullWidth
                        />
                    </InputLayout>
                    <InputLayout isRequired={false} boxStyle={{ mb: 2 }} label="Issuer">
                        <TextField size="small" fullWidth value={issuer} name="issuer" onChange={handleScholarship} />
                    </InputLayout>
                    <InputLayout isRequired={false} boxStyle={{ mb: 2 }} label="Issue Year">
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                            <FormControl fullWidth size="small">
                                <DatePicker
                                    onChange={(value) => handleIssueYear(value)}
                                    value={issuedYear}
                                    views={['year']}
                                    renderInput={(params) => <TextField size="small" {...params} />}
                                />
                            </FormControl>
                        </LocalizationProvider>
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

export default CreateAwardModal
