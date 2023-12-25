import React, { useEffect, useState } from 'react'

import { enGB } from 'date-fns/locale'
import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Header from '~/components/Common/Header'

import InputLayout from './Layout/InputLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { AppStyles } from '~/constants/colors'
import { regexPhoneNumber, regexUrl } from '~/constants/regex'
import { useAppSelector } from '~/hooks/redux-hooks'
import Loading from '~/pages/Loading'
import { isEmpty } from '~/utils/commonFunction'

const CreateGeneralProfile = () => {
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const { userId } = useAppSelector((state) => state.auth)
    const { search } = useLocation()
    const { account, email } = queryString.parse(search)
    const { verifyEmail } = useProfile()
    const [verifyCorrect, setVerifyCorrect] = useState(false)
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const { createGeneralProfile } = useProfile()

    const [generalInfo, setGeneralInfo] = useState({
        publishName: '',
        introduction: '',
        homeAddress: '',
        phoneNumber: '',
        mobilePhone: '',
        gender: '',
    })

    const [academicInfo, setAcademicInfo] = useState({
        orcid: '',
        scientistTile: '',
        adminPositionFunction: '',
        academicFunction: '',
        currentDegree: '',
        fax: '',
    })

    const [error, setError] = useState({
        publishName: false,
        introduction: false,
        homeAddress: false,
        phoneNumber: false,
        mobilePhone: false,
        gender: false,
        orcid: false,
        scientistTile: false,
        adminPositionFunction: false,
        academicFunction: false,
        currentDegree: false,
        fax: false,
        dateOfBirth: false,
        academic: false,
        degree: false,
    })

    const [messageError, setMessageError] = useState({
        publishName: '',
        introduction: '',
        homeAddress: '',
        phoneNumber: '',
        mobilePhone: '',
        gender: '',
        orcid: '',
        scientistTile: '',
        adminPositionFunction: '',
        academicFunction: '',
        currentDegree: '',
        fax: '',
        dateOfBirth: '',
        academic: '',
        degree: '',
    })
    const [datePicker, setDatePicker] = useState({ dateOfBirth: null, academic: null, degree: null })

    const { dateOfBirth, academic, degree } = datePicker
    const { publishName, introduction, homeAddress, phoneNumber, mobilePhone, gender } = generalInfo
    const { orcid, scientistTile, adminPositionFunction, academicFunction, currentDegree, fax } = academicInfo

    const handleGeneralInfo = (event) => {
        const { value, name } = event.target
        setGeneralInfo((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleDatePicker = (value, name) => {
        setDatePicker((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleAcademicInfo = (event) => {
        const { value, name } = event.target
        setAcademicInfo((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        if (account && email && email.endsWith('@fpt.edu.vn')) {
            verifyEmail(account, email, signal)
                .then((response) => {
                    const isVerifyCorrect = response.data
                    if (isVerifyCorrect) setVerifyCorrect(true)
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
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        const isPublishNameValid = !isEmpty(publishName)
        const isIntroductionValid = !isEmpty(introduction)
        const isHomAddressValid = !isEmpty(homeAddress)
        const isPhoneNumberValid = !isEmpty(phoneNumber) && regexPhoneNumber.test(phoneNumber)
        const isMobilePhoneValid = !isEmpty(mobilePhone) && regexPhoneNumber.test(mobilePhone)
        const isGenderValid = !isEmpty(gender)
        const isOrcidValid = !isEmpty(orcid) && regexUrl.test(orcid)
        const isScientistTitleValid = !isEmpty(scientistTile)
        const isAdminPositionFunctionValid = !isEmpty(adminPositionFunction)
        const isAcademicFunctionValid = !isEmpty(academicFunction)
        const isCurrentDegreeValid = !isEmpty(currentDegree)
        const isFaxValid = !isEmpty(fax)
        const isDateOfBirthValid = !!dateOfBirth
        const isYearAcademicValid = !!academic
        const isYearDegreeValid = !!degree

        const isValidForm =
            isPublishNameValid &&
            isIntroductionValid &&
            isHomAddressValid &&
            isPhoneNumberValid &&
            isMobilePhoneValid &&
            isGenderValid &&
            isOrcidValid &&
            isScientistTitleValid &&
            isAdminPositionFunctionValid &&
            isAcademicFunctionValid &&
            isCurrentDegreeValid &&
            isFaxValid &&
            isDateOfBirthValid &&
            isYearAcademicValid &&
            isYearDegreeValid

        if (!isValidForm) {
            setError({
                publishName: !isPublishNameValid,
                introduction: !isIntroductionValid,
                homeAddress: !isHomAddressValid,
                phoneNumber: !isPhoneNumberValid,
                mobilePhone: !isMobilePhoneValid,
                gender: !isGenderValid,
                orcid: !isOrcidValid,
                scientistTile: !isScientistTitleValid,
                adminPositionFunction: !isAdminPositionFunctionValid,
                academicFunction: !isAcademicFunctionValid,
                currentDegree: !isCurrentDegreeValid,
                fax: !isFaxValid,
                dateOfBirth: !isDateOfBirthValid,
                academic: !isYearAcademicValid,
                degree: !isYearDegreeValid,
            })
            setMessageError({
                publishName: !isPublishNameValid ? 'Publish name must not be empty' : '',
                introduction: !isIntroductionValid ? 'Introduction must not be empty' : '',
                homeAddress: !isHomAddressValid ? 'Home address must not be empty' : '',
                phoneNumber:
                    !isPhoneNumberValid && isEmpty(phoneNumber)
                        ? 'Phone Number must not be empty'
                        : 'Phone number is invalid',
                mobilePhone:
                    !isMobilePhoneValid && isEmpty(mobilePhone)
                        ? 'Mobile phone must not be empty'
                        : 'Mobile phone is invalid',
                gender: !isGenderValid ? 'Gender must be selected' : '',
                orcid: !isOrcidValid && isEmpty(orcid) ? 'ORCID must not be empty' : 'Invalid URL',
                scientistTile: !isScientistTitleValid ? 'Scientist title must not be empty' : '',
                adminPositionFunction: !isAdminPositionFunctionValid
                    ? 'Administration Position function must not be empty'
                    : '',
                academicFunction: !isAcademicFunctionValid ? 'Academic function must not be empty' : '',
                currentDegree: !isCurrentDegreeValid ? 'Current degree must not be empty' : '',
                fax: !isFaxValid ? 'Fax must not be empty' : '',
                dateOfBirth: !isDateOfBirthValid ? 'Date of birth must be selected' : '',
                academic: !isYearAcademicValid ? 'Year Of Academic Function Achievement must not be empty' : '',
                degree: !isYearDegreeValid ? 'Year Of Current Degree Achievement must not be empty' : '',
            })
        } else {
            setButtonLoading(true)
            const generalProfile = {
                userId,
                publishName,
                primaryEmail: email,
                orcid,
                introduction,
                dateOfBirth: dateOfBirth,
                gender,
                scientistTitle: scientistTile,
                adminPositionFunction,
                academicFunction,
                academic: academic.getFullYear(),
                currentDegree,
                current: degree.getFullYear(),
                homeAddress,
                phoneNumber,
                mobilePhone,
                fax,
            }
            createGeneralProfile(generalProfile)
                .then((response) => {
                    const scientistProfile = response.data
                    history.push({ pathname: '/scientist-profile', state: { scientistProfile } })
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setButtonLoading(false)
                })
        }
    }

    if (!account || !email || !email.endsWith('@fpt.edu.vn') || userId !== account) {
        if (loading) setLoading(false)
        return (
            <React.Fragment>
                <Header />
                <Box display="flex" alignItems="center" justifyContent="center" height="75vh">
                    <Typography color="error" variant="h4">
                        Your account is invalid or your email is not @fpt.edu.vn email
                    </Typography>
                </Box>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <Header />
            {loading ? (
                <Loading height="80vh" />
            ) : verifyCorrect ? (
                <Container maxWidth="lg">
                    <Typography pl={2} my={3} fontWeight={500} variant="h4">
                        Profile Information
                    </Typography>
                    <Divider />
                    <Box mt={2} onSubmit={handleSubmit} component="form">
                        <Grid container columnSpacing={3}>
                            <Grid item lg={6}>
                                <InputLayout boxStyle={{ mb: 2 }} label="Public Name">
                                    <TextField
                                        onChange={handleGeneralInfo}
                                        value={publishName}
                                        inputProps={{ maxLength: 64 }}
                                        name="publishName"
                                        size="small"
                                        fullWidth
                                        error={error.publishName}
                                        helperText={error.publishName ? messageError.publishName : ''}
                                    />
                                </InputLayout>
                                <InputLayout boxStyle={{ mb: 2 }} label="Date Of Birth">
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                                        <FormControl fullWidth size="small">
                                            <DatePicker
                                                onChange={(value) => handleDatePicker(value, 'dateOfBirth')}
                                                value={dateOfBirth}
                                                views={['day', 'month', 'year']}
                                                renderInput={(params) => (
                                                    <TextField size="small" {...params} error={error.dateOfBirth} />
                                                )}
                                            />
                                        </FormControl>
                                        {error.dateOfBirth && (
                                            <FormHelperText error={error.dateOfBirth}>
                                                {messageError.dateOfBirth}
                                            </FormHelperText>
                                        )}
                                    </LocalizationProvider>
                                </InputLayout>
                                <InputLayout boxStyle={{ mb: 2 }} label="Introduction">
                                    <TextField
                                        onChange={handleGeneralInfo}
                                        value={introduction}
                                        name="introduction"
                                        inputProps={{ maxLength: 1000 }}
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={5}
                                        error={error.introduction}
                                        helperText={error.introduction ? messageError.introduction : ''}
                                    />
                                </InputLayout>
                                <InputLayout boxStyle={{ mb: 2 }} label="Home Address">
                                    <TextField
                                        onChange={handleGeneralInfo}
                                        value={homeAddress}
                                        name="homeAddress"
                                        inputProps={{ maxLength: 256 }}
                                        size="small"
                                        fullWidth
                                        error={error.homeAddress}
                                        helperText={error.homeAddress ? messageError.homeAddress : ''}
                                    />
                                </InputLayout>
                                <InputLayout boxStyle={{ mb: 2 }} label="Phone Number">
                                    <TextField
                                        onChange={handleGeneralInfo}
                                        value={phoneNumber}
                                        inputProps={{ maxLength: 64 }}
                                        name="phoneNumber"
                                        size="small"
                                        fullWidth
                                        placeholder="Ex: +2743650254"
                                        error={error.phoneNumber}
                                        helperText={error.phoneNumber ? messageError.phoneNumber : ''}
                                    />
                                </InputLayout>
                                <InputLayout boxStyle={{ mb: 2 }} label="Mobile Phone">
                                    <TextField
                                        onChange={handleGeneralInfo}
                                        value={mobilePhone}
                                        inputProps={{ maxLength: 64 }}
                                        name="mobilePhone"
                                        placeholder="Ex: +84948264856"
                                        size="small"
                                        fullWidth
                                        error={error.mobilePhone}
                                        helperText={error.mobilePhone ? messageError.mobilePhone : ''}
                                    />
                                </InputLayout>
                                <InputLayout boxStyle={{ mb: 2 }} label="Gender">
                                    <RadioGroup
                                        onChange={handleGeneralInfo}
                                        value={gender}
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="gender"
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    </RadioGroup>
                                    {error.gender && (
                                        <FormHelperText error={error.gender}>{messageError.gender}</FormHelperText>
                                    )}
                                </InputLayout>
                            </Grid>
                            <Grid item lg={6}>
                                <InputLayout boxStyle={{ mb: 2 }} label="Primary Email">
                                    <TextField
                                        inputProps={{ maxLength: 64 }}
                                        name="primaryEmail"
                                        size="small"
                                        fullWidth
                                        disabled={true}
                                        value={email}
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
                                        value={scientistTile}
                                        name="scientistTile"
                                        onChange={handleAcademicInfo}
                                        error={error.scientistTile}
                                        helperText={error.scientistTile ? messageError.scientistTile : ''}
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
                                        helperText={
                                            error.adminPositionFunction ? messageError.adminPositionFunction : ''
                                        }
                                    />
                                </InputLayout>
                                <InputLayout boxStyle={{ mb: 2 }} label="Academic rank">
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
                                                renderInput={(params) => (
                                                    <TextField size="small" {...params} error={error.academic} />
                                                )}
                                            />
                                        </FormControl>
                                        {error.academic && (
                                            <FormHelperText error={error.academic}>
                                                {messageError.academic}
                                            </FormHelperText>
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
                                                renderInput={(params) => (
                                                    <TextField size="small" {...params} error={error.degree} />
                                                )}
                                            />
                                        </FormControl>
                                        {error.degree && (
                                            <FormHelperText error={error.degree}>{messageError.degree}</FormHelperText>
                                        )}
                                    </LocalizationProvider>
                                </InputLayout>
                                <InputLayout boxStyle={{ mb: 2 }} label="Fax">
                                    <TextField
                                        size="small"
                                        value={fax}
                                        name="fax"
                                        onChange={handleAcademicInfo}
                                        fullWidth
                                        error={error.fax}
                                        helperText={error.fax ? messageError.fax : ''}
                                    />
                                </InputLayout>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{
                                px: 2,
                                py: 2,
                                boxShadow: 'inset 0 -1px 0 #edeeef',
                                backgroundColor: AppStyles.colors['#F8F9FA'],
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                variant="outline"
                                sx={{ textTransform: 'none', height: 36 }}
                                onClick={() => history.push('/conferences')}
                            >
                                Go To My Conferences
                            </Button>
                            <Box ml={4}>
                                <LoadingButton
                                    type="submit"
                                    sx={{ textTransform: 'none', height: 36 }}
                                    variant="contained"
                                    loading={buttonLoading}
                                    loadingPosition="start"
                                    startIcon={<Save />}
                                >
                                    Save Changes
                                </LoadingButton>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="75vh">
                    <Typography color="error" variant="h6">
                        Your account is invalid or your email is not @fpt.edu.vn email
                    </Typography>
                </Box>
            )}
        </React.Fragment>
    )
}

export default CreateGeneralProfile
