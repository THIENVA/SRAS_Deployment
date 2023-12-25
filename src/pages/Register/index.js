import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Container, Divider, Paper, Typography } from '@mui/material'
import Header from '~/components/Common/Header'

import LoginInfo from './LoginInfo'
import PersonalInfo from './PersonalInfo'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useAuth from '~/api/common/auth'
import { AppStyles } from '~/constants/colors'
import { emailRegex, passwordRegex } from '~/constants/regex'
import { isEmpty } from '~/utils/commonFunction'

const Register = () => {
    const history = useHistory()
    const showSnackbar = useSnackbar()
    const { register, updateUserInfo } = useAuth()
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        organization: '',
    })
    const [error, setError] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        firstName: false,
        middleName: false,
        lastName: false,
        organization: false,
        countrySelected: false,
    })
    const [messageError, setMessageError] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        middleName: '',
        lastName: '',
        organization: '',
        countrySelected: '',
    })
    const [countrySelected, setCountrySelected] = useState('')
    const [isLoading, setLoading] = useState(false)

    const handleLoginInfoChange = (event) => {
        const { name, value } = event.target
        setLoginInfo((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handlePersonalInfoChange = (event) => {
        const { name, value } = event.target
        setPersonalInfo((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleSelectCountry = (newValue) => {
        setCountrySelected(newValue)
        setMessageError((prev) => ({ ...prev, ['countrySelected']: '' }))
        setError((prev) => ({ ...prev, ['countrySelected']: false }))
    }

    const handleCreateAccount = () => {
        const { email, password, confirmPassword } = loginInfo
        const { firstName, middleName, lastName, organization } = personalInfo
        const isEmail = !isEmpty(email) && emailRegex.test(email)
        const isPassword = !isEmpty(password) && passwordRegex.test(password)
        const isConfirmPassword = password.trim() === confirmPassword.trim()
        const isFirstName = !isEmpty(firstName)
        const isMiddleName = !isEmpty(middleName)
        const isLastName = !isEmpty(lastName)
        const isOrganization = !isEmpty(organization)
        const isCountry = !isEmpty(countrySelected)
        const isValid =
            isEmail &&
            isPassword &&
            isConfirmPassword &&
            isFirstName &&
            isMiddleName &&
            isLastName &&
            isOrganization &&
            isCountry
        if (isValid) {
            setLoading(true)
            const accountInfo = {
                userName: email.split('@')[0],
                emailAddress: email,
                password,
                appName: 'SRAS',
            }

            register(accountInfo)
                .then((response) => {
                    const { firstName, middleName, lastName, organization } = personalInfo
                    const userId = response.data.id
                    const updatedUserInfo = {
                        id: userId,
                        email,
                        password,
                        firstName,
                        middleName,
                        lastName,
                        organization,
                        country: countrySelected,
                        pariticipantId: null,
                    }
                    updateUserInfo(updatedUserInfo)
                        .then(() => {
                            history.push({ pathname: '/confirm-email', state: { email } })
                        })
                        .finally(() => {
                            setLoading(false)
                        })
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        showSnackbar({
                            severity: 'error',
                            children: 'This email has already been used. Please try another email.',
                        })
                    } else {
                        showSnackbar({
                            severity: 'error',
                            children: 'Something went wrong, please try again later.',
                        })
                    }
                    setLoading(false)
                })
        } else {
            setError({
                email: !isEmail,
                password: !isPassword,
                confirmPassword: !isConfirmPassword,
                firstName: !isFirstName,
                middleName: !isMiddleName,
                lastName: !isLastName,
                organization: !isOrganization,
                countrySelected: !isCountry,
            })
            setMessageError({
                email: !isEmail && isEmpty(email) ? 'Email must not be empty' : 'Invalid email',
                password: !isPassword && isEmpty(password) ? 'Password must not be empty' : 'Invalid password',
                confirmPassword: !isConfirmPassword ? 'Confirmed password is not the same with password' : '',
                firstName: !isFirstName ? 'First name must not be empty' : '',
                middleName: !isMiddleName ? 'Middle name must not be empty' : '',
                lastName: !isLastName ? 'Last name must not be empty' : '',
                organization: !isOrganization ? 'Organization must not be empty' : '',
                countrySelected: !isCountry ? 'Country must not be empty' : '',
            })
        }
    }

    return (
        <React.Fragment>
            <Header />
            <Container maxWidth="lg">
                <Paper sx={{ mt: 4, p: 3, pb: 6 }}>
                    <Typography gutterBottom variant="h5" sx={{ fontWeight: 'bold' }}>
                        Create New Account
                    </Typography>
                    <Alert severity="warning">
                        Password has at least 6 characters with at least 1 non-alphanumberic character, upper and lower
                        case character and number!
                    </Alert>
                    <Divider
                        sx={{
                            mt: 1,
                            width: '100%',
                        }}
                    />
                    <LoginInfo
                        loginInfo={loginInfo}
                        handleLoginInfoChange={handleLoginInfoChange}
                        error={error}
                        messageError={messageError}
                    />
                    <PersonalInfo
                        personalInfo={personalInfo}
                        handlePersonalInfoChange={handlePersonalInfoChange}
                        countrySelected={countrySelected}
                        handleSelectCountry={handleSelectCountry}
                        error={error}
                        messageError={messageError}
                    />
                </Paper>
                <Box
                    sx={{
                        mt: 4,
                        px: 2,
                        py: 2,
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Box>
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', height: 36, color: AppStyles.colors['#027A9D'] }}
                            onClick={() => history.push('/login')}
                        >
                            Back to Login
                        </Button>
                    </Box>
                    <Box ml={4}>
                        <LoadingButton
                            sx={{ textTransform: 'none', height: 36 }}
                            variant="contained"
                            onClick={handleCreateAccount}
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            Register
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default Register
