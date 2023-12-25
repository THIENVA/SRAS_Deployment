import { useState } from 'react'

import { Box, ThemeProvider, Typography, createTheme } from '@mui/material'
import HorizontalLinearStepper from '~/components/StepperCompo'

import ConferenceDetail from '../ConferenceDetail'
import ChooseUser from './ChooseUser'
import ComposeEmail from './ComposeEmail'
import FinishInvite from './FinishInvite'
import PreviewEmail from './PreviewEmail'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useOutsider } from '~/api/common/outsider'
import { useReviewer } from '~/api/common/reviewer'
import { ScreenSize } from '~/constants/Sizes'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { INVITE_STEPS } from '~/constants/steps'
import { useAppSelector } from '~/hooks/redux-hooks'

const theme = createTheme({ typography: { fontSize: 18 } })

const InviteReviewer = () => {
    const { createOutsider, updateOutsider, searchParticipantByEmail } = useOutsider()
    const { getHasTrackAccount } = useReviewer()
    const { trackId, tracks, trackName } = useAppSelector((state) => state.trackForChair)
    const { email, firstName, lastName, userId, middleName } = useAppSelector((state) => state.auth)
    const showSnackbar = useSnackbar()
    const [textField, setTextField] = useState({
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        organization: '',
        email: '',
        participantId: '',
    })
    const [emailField, setEmailField] = useState({
        body: 'Dear {Recipient.Name},\n\nYou are invited as a reviewer for {Conference.Name}.\n\nClick the link below to accept.\n{Recipient.LinkInvite}\n\nPlease contact {Sender.Email} if you have questions about the invitation.\n\nThanks,\nSRASS team',
        subject: 'Reviewer Invitation for {Conference.Name}',
        completeBody: '',
        completeSubject: '',
    })
    const [userAccount, setUserAccount] = useState({
        id: '',
        email: '',
        firstName: '',
        middleName: '',
        lastName: '',
        organization: '',
        participantId: '',
    })
    const [countrySelected, setCountrySelected] = useState('')
    const [invitedEmail, setInvitedEmail] = useState('')
    const [activeStep, setActiveStep] = useState(0)
    const [isCreatedInvite, setIsCreatedInvite] = useState(false)
    const [isUpdateInvite, setIsUpdateInvite] = useState(false)
    const [hasAccount, setHasAccount] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [isSearchResult, setSearchResult] = useState(false)
    const [nextStep, setNextStep] = useState(false)
    const [loading, setLoading] = useState(false)
    const [outsiderInfo, setOutsiderInfo] = useState({})
    const [track, setTrack] = useState({ trackId: trackId, trackName: trackName })
    const [actionButtonLoading, setActionButtonLoading] = useState(false)

    const {
        roleConference: { roleName },
        trackConference: { trackId: id, trackName: name },
    } = useAppSelector((state) => state.conference)

    const trackIdSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? id : track.trackId
    const trackNameSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? name : track.trackName

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
    const handleTextChange = (event) => {
        const { name, value } = event.target
        setTextField((prev) => ({ ...prev, [name]: value }))
    }
    const handleEmailChange = (event) => {
        const { name, value } = event.target
        setEmailField((prev) => ({ ...prev, [name]: value }))
    }
    const handleSelectField = (newValue) => {
        setCountrySelected(newValue)
    }
    const handleEmailInvited = (event) => {
        const { value } = event.target
        setInvitedEmail(value)
    }

    const handleSearch = () => {
        setLoading(true)
        if (invitedEmail) {
            searchParticipantByEmail(invitedEmail)
                .then((response) => {
                    const user = response.data
                    setOutsiderInfo(user)
                    if (!user) {
                        setTextField((prev) => ({
                            ...prev,
                            email: invitedEmail,
                            firstName: '',
                            middleName: '',
                            lastName: '',
                            organization: '',
                            participantId: '',
                        }))
                        setCountrySelected('')
                        setSearchResult(false)
                        setIsCreatedInvite(false)
                        setNextStep(false)
                        setIsShow(true)
                        setLoading(false)
                    } else {
                        if (response.data.hasAccount === true) {
                            getHasTrackAccount({ email: invitedEmail, trackId: trackIdSubmitted })
                                .then((response) => {
                                    const data = response.data
                                    if (data === true) {
                                        setIsShow(false)
                                        setNextStep(false)
                                        showSnackbar({
                                            severity: 'error',
                                            children: `Reviewer already in ${trackNameSubmitted}.`,
                                        })
                                    } else {
                                        setUserAccount((prev) => ({
                                            ...prev,
                                            id: user?.userId,
                                            email: user?.email,
                                            firstName: user?.firstName,
                                            lastName: user?.lastName,
                                            organization: user?.organization,
                                            participantId: user?.pariticipantId,
                                        }))
                                        setSearchResult(true)
                                        setHasAccount(true)
                                        setIsShow(true)
                                        setNextStep(true)
                                    }
                                })
                                .catch(() => {
                                    showSnackbar({
                                        severity: 'error',
                                        children: 'Something went wrong, please try again later.',
                                    })
                                })
                                .finally(() => {
                                    setLoading(false)
                                })
                        } else {
                            setTextField((prev) => ({
                                ...prev,
                                id: user?.outsiderId,
                                email: user?.email,
                                firstName: user?.firstName,
                                middleName: user?.middleName,
                                lastName: user?.lastName,
                                organization: user?.organization,
                                participantId: user?.pariticipantId,
                            }))
                            setCountrySelected(user?.country)
                            setSearchResult(false)
                            setHasAccount(false)
                            setIsCreatedInvite(true)
                            setIsShow(true)
                            setNextStep(true)
                            setLoading(false)
                        }
                    }
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                    setLoading(false)
                })
                .finally(() => {
                    setIsUpdateInvite(false)
                })
        }
    }

    const handleCreateOutsider = () => {
        setActionButtonLoading(true)
        const { firstName, lastName, organization, email, middleName } = textField
        const info = {
            firstname: firstName,
            lastname: lastName,
            middlename: middleName,
            country: countrySelected,
            organization: organization,
            email: email,
        }
        createOutsider(info)
            .then((response) => {
                const user = response.data
                setOutsiderInfo(user)
                setTextField((prev) => ({
                    ...prev,
                    id: user?.outsiderId,
                    email: user?.email,
                    firstName: user?.firstname,
                    middleName: user?.middlename,
                    lastName: user?.lastname,
                    organization: user?.organization,
                    participantId: user?.participantId,
                }))
                setCountrySelected(user?.country)

                setIsCreatedInvite(true)
                setNextStep(true)
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setActionButtonLoading(false)
            })
    }
    const handleUpdateOutsider = () => {
        setActionButtonLoading(true)
        const { id, firstName, lastName, organization, email, middleName } = textField
        const info = {
            id: id,
            firstname: firstName,
            lastname: lastName,
            middlename: middleName,
            country: countrySelected,
            organization: organization,
            email: email,
        }

        updateOutsider(info)
            .then(() => {
                setIsCreatedInvite(true)
                setIsUpdateInvite(false)
                setNextStep(true)
                // showSnackbar({ severity: 'success', children: `${data.message}` })
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setActionButtonLoading(false)
            })
    }

    const cancelUpdate = () => {
        setTextField((prev) => ({
            ...prev,
            id: outsiderInfo?.id,
            email: outsiderInfo?.email,
            firstName: outsiderInfo?.firstName,
            middleName: outsiderInfo?.middleName,
            lastName: outsiderInfo?.lastName,
            organization: outsiderInfo?.organization,
            participantId: outsiderInfo?.pariticipantId,
        }))
        setCountrySelected(outsiderInfo?.country)
        setIsCreatedInvite(true)
        setIsUpdateInvite(false)
        setNextStep(true)
    }

    const handleChangeTrack = (newValue) => {
        const { children, value } = newValue.props
        setTrack((prev) => ({ ...prev, trackName: children, trackId: value }))
    }

    return (
        <ConferenceDetail>
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Box mb={1} display="flex" justifyContent="space-between">
                    <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                        Invite Reviewer
                    </Typography>
                </Box>
                <ThemeProvider theme={theme}>
                    <HorizontalLinearStepper alternativeLabel={false} steps={INVITE_STEPS} activeStep={activeStep} />
                    {(() => {
                        switch (activeStep) {
                            case 0:
                                return (
                                    <ChooseUser
                                        handleNext={handleNext}
                                        activeStep={activeStep}
                                        textField={textField}
                                        handleTextChange={handleTextChange}
                                        steps={INVITE_STEPS}
                                        handleEmailInvited={handleEmailInvited}
                                        invitedEmail={invitedEmail}
                                        isCreatedInvite={isCreatedInvite}
                                        isShow={isShow}
                                        isSearchResult={isSearchResult}
                                        nextStep={nextStep}
                                        handleSearch={handleSearch}
                                        loading={loading}
                                        handleCreateOutsider={handleCreateOutsider}
                                        handleCountrySelected={handleSelectField}
                                        countrySelected={countrySelected}
                                        setIsCreatedInvite={setIsCreatedInvite}
                                        setIsUpdateInvite={setIsUpdateInvite}
                                        isUpdateInvite={isUpdateInvite}
                                        setNextStep={setNextStep}
                                        handleUpdateOutsider={handleUpdateOutsider}
                                        hasAccount={hasAccount}
                                        userAccount={userAccount}
                                        cancelUpdate={cancelUpdate}
                                        actionButtonLoading={actionButtonLoading}
                                        handleChangeTrack={handleChangeTrack}
                                        track={track}
                                        tracks={tracks}
                                    />
                                )
                            case 1:
                                return (
                                    <ComposeEmail
                                        handleNext={handleNext}
                                        activeStep={activeStep}
                                        infoField={hasAccount === true ? userAccount : textField}
                                        emailField={emailField}
                                        handleTextChange={handleEmailChange}
                                        handleBack={handleBack}
                                        steps={INVITE_STEPS}
                                        fromFirstName={firstName}
                                        fromLastName={lastName}
                                        fromMiddleName={middleName}
                                        fromEmail={email}
                                        trackIdSubmitted={trackIdSubmitted}
                                        userId={userId}
                                        setEmailField={setEmailField}
                                    />
                                )
                            case 2:
                                return (
                                    <PreviewEmail
                                        infoField={hasAccount === true ? userAccount : textField}
                                        handleNext={handleNext}
                                        activeStep={activeStep}
                                        handleBack={handleBack}
                                        steps={INVITE_STEPS}
                                        fromFirstName={firstName}
                                        fromLastName={lastName}
                                        fromMiddleName={middleName}
                                        fromEmail={email}
                                        emailField={emailField}
                                        userId={userId}
                                        trackIdSubmitted={trackIdSubmitted}
                                    />
                                )
                            case 3:
                                return <FinishInvite infoField={hasAccount === true ? userAccount : textField} />
                        }
                    })()}
                </ThemeProvider>
            </Box>
        </ConferenceDetail>
    )
}

export default InviteReviewer
