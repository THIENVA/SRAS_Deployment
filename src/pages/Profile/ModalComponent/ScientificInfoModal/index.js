import { useState } from 'react'

import { enGB } from 'date-fns/locale'
import { cloneDeep } from 'lodash'

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

import InputLayout from '../InputLayout'
import AlsoKnownAs from './AlsoKnownAs'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { regexUrl } from '~/constants/regex'
import { isEmpty } from '~/utils/commonFunction'

const ScientificInfoModal = ({
    open,
    handleClose,
    publishName: profilePublicName,
    academic: profileAcademic,
    scientistTitle: profileScientistTitle,
    orcid: profileOrcid,
    adminPositionFunction: profileAdminPositionFunction,
    degree: profileDegree,
    currentDegree: profileCurrentDegree,
    academicFunction: profileAcademicFunction,
    alsoKnownAs: profileAlsoKnownAs,
    userId,
    profile: userProfile,
    setProfile,
}) => {
    const { updateAlsoKnownAs, updateScienceProfile } = useProfile()
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [academicInfo, setAcademicInfo] = useState({
        publishName: profilePublicName,
        orcid: profileOrcid,
        scientistTitle: profileScientistTitle,
        adminPositionFunction: profileAdminPositionFunction,
        academicFunction: profileAcademicFunction,
        currentDegree: profileCurrentDegree,
    })
    const [datePicker, setDatePicker] = useState({
        academic: new Date(profileAcademic, 0),
        degree: new Date(profileDegree, 0),
    })
    const [error, setError] = useState({
        publishName: false,
        orcid: false,
        scientistTitle: false,
        adminPositionFunction: false,
        academicFunction: false,
        currentDegree: false,
        academic: false,
        degree: false,
    })

    const [messageError, setMessageError] = useState({
        publishName: '',
        orcid: '',
        scientistTitle: '',
        adminPositionFunction: '',
        academicFunction: '',
        currentDegree: '',
        academic: '',
        degree: '',
    })
    const [alsoKnownAs, setAlsoKnownAs] = useState(profileAlsoKnownAs)

    const { publishName, orcid, scientistTitle, adminPositionFunction, academicFunction, currentDegree } = academicInfo
    const { academic, degree } = datePicker

    const handleAcademicInfo = (event) => {
        const { value, name } = event.target
        setAcademicInfo((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleDatePicker = (value, name) => {
        setDatePicker((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleSubmit = () => {
        const isPublishNameValid = !isEmpty(publishName)
        const isOrcidValid = !isEmpty(orcid) && regexUrl.test(orcid)
        const isScientistTitleValid = !isEmpty(scientistTitle)
        const isAdminPositionFunctionValid = !isEmpty(adminPositionFunction)
        const isAcademicFunctionValid = !isEmpty(academicFunction)
        const isCurrentDegreeValid = !isEmpty(currentDegree)
        const isYearAcademicValid = !!academic
        const isYearDegreeValid = !!academic
        const isInvalid = alsoKnownAs.some((link) => isEmpty(link.name))

        const isAcademicInfoValid =
            isOrcidValid &&
            isScientistTitleValid &&
            isAdminPositionFunctionValid &&
            isAcademicFunctionValid &&
            isCurrentDegreeValid &&
            isPublishNameValid &&
            isYearAcademicValid &&
            isYearDegreeValid

        if (!isAcademicInfoValid || isInvalid) {
            const updatedNames = alsoKnownAs.map((item) => {
                if (isEmpty(item.name)) {
                    item.messageName = 'The name must not be empty'
                }
                return item
            })
            setError({
                publishName: !isPublishNameValid,
                orcid: !isOrcidValid,
                scientistTile: !isScientistTitleValid,
                adminPositionFunction: !isAdminPositionFunctionValid,
                academicFunction: !isAcademicFunctionValid,
                currentDegree: !isCurrentDegreeValid,
                academic: !isYearAcademicValid,
                degree: !isYearDegreeValid,
            })
            setMessageError({
                publishName: !isPublishNameValid ? 'Publish name must not be empty' : '',
                orcid: !isOrcidValid && isEmpty(orcid) ? 'ORCID must not be empty' : 'Invalid URL',
                scientistTile: !isScientistTitleValid ? 'Scientist title must not be empty' : '',
                adminPositionFunction: !isAdminPositionFunctionValid
                    ? 'Administration Position function must not be empty'
                    : '',
                academicFunction: !isAcademicFunctionValid ? 'Academic function must not be empty' : '',
                currentDegree: !isCurrentDegreeValid ? 'Current degree must not be empty' : '',
                academic: !isYearAcademicValid ? 'Year Of Academic Function Achievement must not be empty' : '',
                degree: !isYearDegreeValid ? 'Year Of Current Degree Achievement must not be empty' : '',
            })
            setAlsoKnownAs(cloneDeep(updatedNames))
        } else {
            setLoading(true)
            const profile = {
                publishName,
                academic: academic.getFullYear(),
                scientistTitle,
                orcid,
                adminPositionFunction,
                current: degree.getFullYear(),
                currentDegree,
                academicFunction,
            }
            const alsoKnownAsUpdate = updateAlsoKnownAs(userId, { value: JSON.stringify(alsoKnownAs) })
            const scienceProfile = updateScienceProfile(userId, profile)
            Promise.all([alsoKnownAsUpdate, scienceProfile])
                .then(() => {
                    const updatedProfile = cloneDeep(userProfile)
                    const updatedAlsoKnownAs = cloneDeep(alsoKnownAs)
                    updatedProfile.publishName = publishName
                    updatedProfile.academicFunction = academicFunction
                    updatedProfile.current = degree.getFullYear()
                    updatedProfile.currentDegree = currentDegree
                    updatedProfile.academic = academic.getFullYear()
                    updatedProfile.orcid = orcid
                    updatedProfile.adminPositionFunction = adminPositionFunction
                    updatedProfile.scientistTitle = scientistTitle
                    updatedProfile.alsoKnownAs = JSON.stringify(updatedAlsoKnownAs)
                    setProfile(updatedProfile)
                    handleClose()
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. please try again later.',
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
                    Your Current Scientific Career
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
                    <InputLayout boxStyle={{ mb: 2 }} label="Public Name">
                        <TextField
                            onChange={handleAcademicInfo}
                            value={publishName}
                            inputProps={{ maxLength: 64 }}
                            name="publishName"
                            size="small"
                            placeholder="Your Publish Name"
                            fullWidth
                            error={error.publishName}
                            helperText={error.publishName ? messageError.publishName : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="ORCID">
                        <TextField
                            onChange={handleAcademicInfo}
                            inputProps={{ maxLength: 64 }}
                            name="orcid"
                            size="small"
                            fullWidth
                            value={orcid}
                            error={error.orcid}
                            helperText={error.orcid ? messageError.orcid : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Scientist Title">
                        <TextField
                            size="small"
                            fullWidth
                            value={scientistTitle}
                            name="scientistTitle"
                            onChange={handleAcademicInfo}
                            error={error.scientistTitle}
                            helperText={error.scientistTitle ? messageError.scientistTitle : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Administration Position function">
                        <TextField
                            size="small"
                            fullWidth
                            value={adminPositionFunction}
                            name="adminPositionFunction"
                            onChange={handleAcademicInfo}
                            error={error.adminPositionFunction}
                            helperText={error.adminPositionFunction ? messageError.adminPositionFunction : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Academic Rank">
                        <TextField
                            size="small"
                            fullWidth
                            value={academicFunction}
                            name="academicFunction"
                            onChange={handleAcademicInfo}
                            error={error.academicFunction}
                            helperText={error.academicFunction ? messageError.academicFunction : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Year Of Academic Function Achievement">
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                            <FormControl sx={{ width: 300 }} size="small">
                                <DatePicker
                                    value={academic}
                                    onChange={(value) => handleDatePicker(value, 'academic')}
                                    views={['year']}
                                    renderInput={(params) => <TextField size="small" {...params} />}
                                />
                            </FormControl>
                            {error.academic && (
                                <FormHelperText error={error.academic}>{messageError.academic}</FormHelperText>
                            )}
                        </LocalizationProvider>
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Current Degree">
                        <TextField
                            size="small"
                            fullWidth
                            value={currentDegree}
                            onChange={handleAcademicInfo}
                            name="currentDegree"
                            error={error.currentDegree}
                            helperText={error.currentDegree ? messageError.currentDegree : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Year Of Current Degree Achievement">
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                            <FormControl sx={{ width: 300 }} size="small">
                                <DatePicker
                                    onChange={(value) => handleDatePicker(value, 'degree')}
                                    value={degree}
                                    views={['year']}
                                    renderInput={(params) => <TextField size="small" {...params} />}
                                />
                            </FormControl>
                            {error.degree && (
                                <FormHelperText error={error.degree}>{messageError.degree}</FormHelperText>
                            )}
                        </LocalizationProvider>
                    </InputLayout>
                    <AlsoKnownAs alsoKnownAs={alsoKnownAs} setAlsoKnownAs={setAlsoKnownAs} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={loading}
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

export default ScientificInfoModal
