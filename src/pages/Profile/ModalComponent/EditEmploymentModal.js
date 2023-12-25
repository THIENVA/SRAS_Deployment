import { useState } from 'react'

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
    FormHelperText,
    IconButton,
    TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import TransitionCompo from '~/components/TransitionCompo'

import InputLayout from './InputLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { regexUrl } from '~/constants/regex'
import { isEmpty } from '~/utils/commonFunction'

const EditEmploymentModal = ({ open, handleClose, userId, employments, setEmployments, getEmployment }) => {
    const { updateEmployment } = useProfile()
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [organization, setOrganization] = useState({
        organizationName: getEmployment.organization.organizationName,
        organizationDescription: getEmployment.organization.organizationDescription,
        organizationWebsite: getEmployment.organization.organizationWebsite,
        organizationPhoneNumber: getEmployment.organization.organizationPhoneNumber,
        grid: getEmployment.organization.grid,
    })

    const [employment, setEmployMent] = useState({
        employmentPosition: getEmployment.employmentPosition,
    })
    const [datePicker, setDatePicker] = useState({
        startDate: new Date(getEmployment.startDate),
        endDate: new Date(getEmployment.endDate),
    })

    const [error, setError] = useState({
        organizationName: false,
        organizationPhoneNumber: false,
        employmentPosition: false,
        startDate: false,
        endDate: false,
        organizationWebsite: false,
    })

    const [messageError, setMessageError] = useState({
        organizationName: '',
        organizationPhoneNumber: '',
        employmentPosition: '',
        startDate: '',
        endDate: '',
        organizationWebsite: '',
    })

    const { organizationName, organizationDescription, organizationWebsite, organizationPhoneNumber, grid } =
        organization
    const { employmentPosition } = employment
    const { startDate, endDate } = datePicker
    const handleOrganization = (event) => {
        const { value, name } = event.target
        setOrganization((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleEmployment = (event) => {
        const { value, name } = event.target
        setEmployMent((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleDatePicker = (value, name) => {
        setDatePicker((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleSubmit = () => {
        const isOrganizationName = !isEmpty(organizationName)
        const isOrganizationPhoneNumber = !isEmpty(organizationPhoneNumber)
        const isEmploymentPosition = !isEmpty(employmentPosition)
        const isStartDate = !!startDate
        const isEndDate = !!endDate
        const isWebsiteUrl = isEmpty(organizationWebsite) ? true : regexUrl.test(organizationWebsite)
        const isValid =
            isOrganizationName &&
            isOrganizationPhoneNumber &&
            isEmploymentPosition &&
            isStartDate &&
            isEndDate &&
            isWebsiteUrl
        if (!isValid) {
            setError({
                organizationName: !isOrganizationName,
                organizationPhoneNumber: !isOrganizationPhoneNumber,
                employmentPosition: !isEmploymentPosition,
                startDate: !isStartDate,
                endDate: !isEndDate,
                organizationWebsite: !isWebsiteUrl,
            })
            setMessageError({
                organizationName: !isOrganizationName ? 'Organization name must not be empty' : '',
                organizationPhoneNumber: !isOrganizationPhoneNumber
                    ? 'Organization phone number must not be empty'
                    : '',
                employmentPosition: !isEmploymentPosition ? 'Organization position must not be empty' : '',
                startDate: !isStartDate ? 'Start date must be selected' : '',
                endDate: !isEndDate ? 'End date must be selected' : '',
                organizationWebsite: !isWebsiteUrl ? 'Invalid URL' : '',
            })
        } else {
            setLoading(true)
            const employmentData = {
                employmentId: uuid(),
                organization: {
                    organizationId: uuid(),
                    organizationName,
                    organizationDescription,
                    organizationWebsite,
                    organizationPhoneNumber,
                    grid,
                },
                startDate: startDate,
                endDate: endDate,
                employmentPosition,
            }
            const formatEmployment = cloneDeep(employmentData)
            const cloneEmployments = cloneDeep(employments)
            const position = cloneEmployments.findIndex((item) => item.employmentId === getEmployment.employmentId)
            cloneEmployments.splice(position, 1, formatEmployment)
            updateEmployment(userId, cloneEmployments)
                .then(() => {
                    setEmployments(cloneEmployments)
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
                    Edit Employment
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
                    <InputLayout boxStyle={{ mb: 2 }} label="Role / Position">
                        <TextField
                            onChange={handleEmployment}
                            value={employmentPosition}
                            inputProps={{ maxLength: 64 }}
                            name="employmentPosition"
                            size="small"
                            fullWidth
                            error={error.employmentPosition}
                            helperText={error.employmentPosition ? messageError.employmentPosition : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Start Date">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl fullWidth size="small">
                                <DatePicker
                                    onChange={(value) => handleDatePicker(value, 'startDate')}
                                    value={startDate}
                                    inputFormat="MM/yyyy"
                                    views={['month', 'year']}
                                    renderInput={(params) => (
                                        <TextField size="small" {...params} error={error.startDate} />
                                    )}
                                />
                            </FormControl>
                            {error.startDate && (
                                <FormHelperText error={error.startDate}>{messageError.startDate}</FormHelperText>
                            )}
                        </LocalizationProvider>
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="End Date">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <FormControl fullWidth size="small">
                                <DatePicker
                                    onChange={(value) => handleDatePicker(value, 'endDate')}
                                    value={endDate}
                                    inputFormat="MM/yyyy"
                                    views={['month', 'year']}
                                    renderInput={(params) => (
                                        <TextField size="small" {...params} error={error.endDate} />
                                    )}
                                />
                            </FormControl>
                            {error.endDate && (
                                <FormHelperText error={error.endDate}>{messageError.endDate}</FormHelperText>
                            )}
                        </LocalizationProvider>
                    </InputLayout>
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
                            inputProps={{ maxLength: 64 }}
                            name="organizationDescription"
                            size="small"
                            fullWidth
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

export default EditEmploymentModal
