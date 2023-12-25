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
    FormHelperText,
    IconButton,
    MenuItem,
    Select,
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

const EditEducationModal = ({
    open,
    handleClose,
    userId,
    setEducations,
    educations,
    academicDegrees,
    getEducation,
}) => {
    const { updateEducation } = useProfile()
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [organization, setOrganization] = useState({
        organizationName: getEducation.educationalOrganization.organizationName,
        organizationDescription: getEducation.educationalOrganization.organizationDescription,
        organizationWebsite: getEducation.educationalOrganization.organizationWebsite,
        organizationPhoneNumber: getEducation.educationalOrganization.organizationPhoneNumber,
        grid: getEducation.educationalOrganization.grid,
    })
    const [education, setEducation] = useState({
        degreeAbbreviation: getEducation.degreeAbbreviation,
        degree: getEducation.degree,
    })
    const [academicDegree, setAcademicDegree] = useState({
        academicDegreeId: getEducation.academicDegreeId,
        academicDegreeName: getEducation.academicDegreeName,
    })
    const [datePicker, setDatePicker] = useState({
        startYear: new Date(getEducation.startYear, 0),
        yearOfGraduation: new Date(getEducation.yearOfGraduation, 0),
    })

    const [error, setError] = useState({
        organizationName: false,
        organizationPhoneNumber: false,
        employmentPosition: false,
        startYear: false,
        yearOfGraduation: false,
        degreeAbbreviation: false,
        degree: false,
        academicDegreeId: false,
        organizationWebsite: false,
    })

    const [messageError, setMessageError] = useState({
        organizationName: '',
        organizationPhoneNumber: '',
        employmentPosition: '',
        startYear: '',
        yearOfGraduation: '',
        degreeAbbreviation: '',
        degree: '',
        academicDegreeId: '',
        organizationWebsite: '',
    })

    const { organizationName, organizationDescription, organizationWebsite, organizationPhoneNumber, grid } =
        organization
    const { degreeAbbreviation, degree } = education
    const { startYear, yearOfGraduation } = datePicker
    const { academicDegreeId, academicDegreeName } = academicDegree

    const handleOrganization = (event) => {
        const { value, name } = event.target
        setOrganization((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleEducation = (event) => {
        const { value, name } = event.target
        setEducation((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleSelectAcademicDegree = (_, { props }) => {
        setAcademicDegree({ academicDegreeId: props.value, academicDegreeName: props.children })
        setMessageError((prev) => ({ ...prev, ['academicDegree']: '' }))
        setError((prev) => ({ ...prev, ['academicDegree']: false }))
    }

    const handleDatePicker = (value, name) => {
        setDatePicker((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleSubmit = () => {
        const isOrganizationName = !isEmpty(organizationName)
        const isOrganizationPhoneNumber = !isEmpty(organizationPhoneNumber)
        const isDegreeAbbreviation = !isEmpty(degreeAbbreviation)
        const isDegree = !isEmpty(degree)
        const isStartYear = !!startYear
        const isYearOfGraduation = !!yearOfGraduation
        const isAcademicId = academicDegreeId !== -1
        const isWebsiteUrl = isEmpty(organizationWebsite) ? true : regexUrl.test(organizationWebsite)

        const isValid =
            isOrganizationName &&
            isOrganizationPhoneNumber &&
            isDegreeAbbreviation &&
            isDegree &&
            isStartYear &&
            isYearOfGraduation &&
            isAcademicId &&
            isWebsiteUrl

        if (!isValid) {
            setError({
                organizationName: !isOrganizationName,
                organizationPhoneNumber: !isOrganizationPhoneNumber,
                degree: !isDegree,
                degreeAbbreviation: !isDegreeAbbreviation,
                startYear: !isStartYear,
                yearOfGraduation: !isYearOfGraduation,
                academicDegreeId: !isAcademicId,
                organizationWebsite: !isWebsiteUrl,
            })
            setMessageError({
                organizationName: !isOrganizationName ? 'Organization name must not be empty' : '',
                organizationPhoneNumber: !isOrganizationPhoneNumber
                    ? 'Organization phone number must not be empty'
                    : '',
                degree: !isDegree ? 'Full name of degree must not be empty' : '',
                degreeAbbreviation: !isDegreeAbbreviation ? 'Degree Abbreviation must not be empty' : '',
                startYear: !isStartYear ? 'Start Year must be selected' : '',
                yearOfGraduation: !isYearOfGraduation ? 'Year of graduation must be selected' : '',
                academicDegreeId: !isAcademicId ? 'Academic degree must be selected' : '',
                organizationWebsite: !isWebsiteUrl ? 'Invalid URL' : '',
            })
        } else {
            setLoading(true)
            const educationData = {
                educationId: uuid(),
                academicDegreeId,
                educationalOrganization: {
                    organizationId: uuid(),
                    organizationName,
                    organizationDescription,
                    organizationWebsite,
                    organizationPhoneNumber,
                    grid,
                },
                startYear: startYear.getFullYear(),
                yearOfGraduation: yearOfGraduation.getFullYear(),
                degree,
                degreeAbbreviation,
            }
            const formatEducation = { ...cloneDeep(educationData), academicDegreeName }
            const cloneEducations = cloneDeep(educations)
            const position = cloneEducations.findIndex((item) => item.educationId === getEducation.educationId)
            cloneEducations.splice(position, 1, formatEducation)
            updateEducation(userId, cloneEducations)
                .then(() => {
                    setEducations(cloneEducations)
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
                    Edit Education
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
                    <InputLayout boxStyle={{ mb: 2 }} label="Full Name Of Degree">
                        <TextField
                            onChange={handleEducation}
                            value={degree}
                            inputProps={{ maxLength: 64 }}
                            name="degree"
                            size="small"
                            fullWidth
                            error={error.degree}
                            helperText={error.degree ? messageError.degree : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Degree Abbreviation">
                        <TextField
                            onChange={handleEducation}
                            value={degreeAbbreviation}
                            inputProps={{ maxLength: 64 }}
                            name="degreeAbbreviation"
                            size="small"
                            fullWidth
                            error={error.degreeAbbreviation}
                            helperText={error.degreeAbbreviation ? messageError.degreeAbbreviation : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Academic Degree">
                        <Select
                            sx={{ minWidth: 200 }}
                            onChange={handleSelectAcademicDegree}
                            value={academicDegreeId}
                            size="small"
                            error={error.academicDegreeId}
                        >
                            {academicDegrees.map((item) => (
                                <MenuItem key={item.referenceTypeId} value={item.referenceTypeId}>
                                    {item.referenceTypeName}
                                </MenuItem>
                            ))}
                        </Select>
                        {error.academicDegreeId && (
                            <FormHelperText error={error.academicDegreeId}>
                                {messageError.academicDegreeId}
                            </FormHelperText>
                        )}
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Start Year">
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                            <FormControl error={error.startYear} fullWidth size="small">
                                <DatePicker
                                    onChange={(value) => handleDatePicker(value, 'startYear')}
                                    value={startYear}
                                    views={['year']}
                                    renderInput={(params) => (
                                        <TextField size="small" {...params} error={error.startYear} />
                                    )}
                                />
                            </FormControl>
                            {error.startYear && (
                                <FormHelperText error={error.startYear}>{messageError.startYear}</FormHelperText>
                            )}
                        </LocalizationProvider>
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Year Of Education">
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                            <FormControl fullWidth size="small">
                                <DatePicker
                                    onChange={(value) => handleDatePicker(value, 'yearOfGraduation')}
                                    value={yearOfGraduation}
                                    views={['year']}
                                    renderInput={(params) => (
                                        <TextField size="small" {...params} error={error.yearOfGraduation} />
                                    )}
                                />
                            </FormControl>
                            {error.yearOfGraduation && (
                                <FormHelperText error={error.yearOfGraduation}>
                                    {messageError.yearOfGraduation}
                                </FormHelperText>
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

export default EditEducationModal
