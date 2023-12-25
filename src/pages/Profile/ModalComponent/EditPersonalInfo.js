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
    FormControlLabel,
    FormHelperText,
    IconButton,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import TransitionCompo from '~/components/TransitionCompo'

import InputLayout from './InputLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { regexPhoneNumber } from '~/constants/regex'
import { isEmpty } from '~/utils/commonFunction'

const PersonalModal = ({
    open,
    handleClose,
    gender: profileGender,
    mobilePhone: profileMobilePhone,
    fax: profileFax,
    phoneNumber: profilePhoneNumber,
    dateOfBirth: profileDateOfBirth,
    introduction: profileIntroduction,
    homeAddress: profileHomeAddress,
    userId,
    profile: userProfile,
    setProfile,
}) => {
    const { updateGeneralProfile } = useProfile()
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [generalInfo, setAcademicInfo] = useState({
        gender: profileGender,
        mobilePhone: profileMobilePhone,
        fax: profileFax,
        phoneNumber: profilePhoneNumber,
        introduction: profileIntroduction,
        homeAddress: profileHomeAddress,
    })
    const [dateOfBirth, setDateOfBirth] = useState(new Date(profileDateOfBirth))
    const [error, setError] = useState({
        gender: false,
        mobilePhone: false,
        fax: false,
        phoneNumber: false,
        introduction: false,
        dateOfBirth: false,
        homeAddress: false,
    })

    const [messageError, setMessageError] = useState({
        gender: '',
        mobilePhone: '',
        fax: '',
        phoneNumber: '',
        introduction: '',
        dateOfBirth: '',
        homeAddress: '',
    })

    const { gender, mobilePhone, fax, phoneNumber, introduction, homeAddress } = generalInfo

    const handleGeneralInfo = (event) => {
        const { value, name } = event.target
        setAcademicInfo((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleDatePicker = (value) => {
        setDateOfBirth(value)
        setMessageError((prev) => ({ ...prev, ['dateOfBirth']: '' }))
        setError((prev) => ({ ...prev, ['dateOfBirth']: false }))
    }

    const handleSubmit = () => {
        const isIntroductionValid = !isEmpty(introduction)
        const isHomAddressValid = !isEmpty(homeAddress)
        const isPhoneNumberValid = !isEmpty(phoneNumber) && regexPhoneNumber.test(phoneNumber)
        const isMobilePhoneValid = !isEmpty(mobilePhone) && regexPhoneNumber.test(mobilePhone)
        const isGenderValid = !isEmpty(gender)
        const isFaxValid = !isEmpty(fax)
        const isDateOfBirthValid = !!dateOfBirth

        const isGeneralInfo =
            isIntroductionValid &&
            isHomAddressValid &&
            isPhoneNumberValid &&
            isMobilePhoneValid &&
            isGenderValid &&
            isFaxValid &&
            isDateOfBirthValid

        if (!isGeneralInfo) {
            setError({
                introduction: !isIntroductionValid,
                homeAddress: !isHomAddressValid,
                phoneNumber: !isPhoneNumberValid,
                mobilePhone: !isMobilePhoneValid,
                gender: !isGenderValid,
                fax: !isFaxValid,
                dateOfBirth: !isDateOfBirthValid,
            })
            setMessageError({
                introduction: !isIntroductionValid ? 'Introduction must not be empty' : '',
                homeAddress: !isHomAddressValid ? 'Home Address not be empty' : '',
                phoneNumber:
                    !isPhoneNumberValid && isEmpty(phoneNumber)
                        ? 'Phone Number must not be empty'
                        : 'Phone number is invalid',
                mobilePhone:
                    !isMobilePhoneValid && isEmpty(mobilePhone)
                        ? 'Mobile phone must not be empty'
                        : 'Mobile phone is invalid',
                gender: !isGenderValid ? 'Gender must be selected' : '',
                fax: !isFaxValid ? 'Fax must not be empty' : '',
                dateOfBirth: !isDateOfBirthValid ? 'Date of birth must not be empty' : '',
            })
        } else {
            setLoading(true)
            const profile = {
                phoneNumber,
                mobilePhone,
                homeAddress,
                fax,
                gender,
                dateOfBirth,
                introduction,
            }
            const updatedProfile = cloneDeep(userProfile)
            updatedProfile.phoneNumber = phoneNumber
            updatedProfile.mobilePhone = mobilePhone
            updatedProfile.gender = gender
            updatedProfile.dateOfBirth = dateOfBirth
            updatedProfile.fax = fax
            updatedProfile.homeAddress = homeAddress
            updatedProfile.introduction = introduction
            updateGeneralProfile(userId, profile)
                .then(() => {
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
                    Overview
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
                    <InputLayout boxStyle={{ mb: 2 }} label="Home Address">
                        <TextField
                            onChange={handleGeneralInfo}
                            inputProps={{ maxLength: 64 }}
                            name="homeAddress"
                            size="small"
                            fullWidth
                            value={homeAddress}
                            error={error.homeAddress}
                            helperText={error.homeAddress ? messageError.homeAddress : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Phone Number">
                        <TextField
                            onChange={handleGeneralInfo}
                            inputProps={{ maxLength: 64 }}
                            placeholder="Ex: +84948264856"
                            name="phoneNumber"
                            size="small"
                            fullWidth
                            value={phoneNumber}
                            error={error.phoneNumber}
                            helperText={error.phoneNumber ? messageError.phoneNumber : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Mobile Phone">
                        <TextField
                            size="small"
                            fullWidth
                            value={mobilePhone}
                            name="mobilePhone"
                            placeholder="Ex: +2743650254"
                            onChange={handleGeneralInfo}
                            error={error.mobilePhone}
                            helperText={error.mobilePhone ? messageError.mobilePhone : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Fax">
                        <TextField
                            size="small"
                            fullWidth
                            value={fax}
                            name="fax"
                            onChange={handleGeneralInfo}
                            error={error.fax}
                            helperText={error.fax ? messageError.fax : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Introduction">
                        <TextField
                            size="small"
                            fullWidth
                            value={introduction}
                            name="introduction"
                            onChange={handleGeneralInfo}
                            error={error.introduction}
                            helperText={error.introduction ? messageError.introduction : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Date Of Birth">
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                            <FormControl sx={{ width: 300 }} size="small">
                                <DatePicker
                                    value={dateOfBirth}
                                    onChange={(value) => handleDatePicker(value)}
                                    views={['day', 'month', 'year']}
                                    renderInput={(params) => <TextField size="small" {...params} />}
                                />
                            </FormControl>
                            {error.dateOfBirth && (
                                <FormHelperText error={error.dateOfBirth}>{messageError.dateOfBirth}</FormHelperText>
                            )}
                        </LocalizationProvider>
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Gender">
                        <RadioGroup onChange={handleGeneralInfo} value={gender} row name="gender">
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                        {error.gender && <FormHelperText error={error.gender}>{messageError.gender}</FormHelperText>}
                    </InputLayout>
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

export default PersonalModal
