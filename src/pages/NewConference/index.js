import React, { useEffect, useState } from 'react'

import { getDownloadURL, ref as getStorageRef, uploadBytesResumable } from 'firebase/storage'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Header from '~/components/Common/Header'

import Chairs from './ChairsTabel'
import ConferenceLogo from './ConferenceLogo'
import RequireDetails from './RequireDetails'
import TrackManagement from './TrackManagement'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useConference } from '~/api/common/conference'
import { useUser } from '~/api/common/user'
import { regexUrl } from '~/constants/regex'
import { storage } from '~/utils/Firebase'
import { checkDuplicated, isEmpty } from '~/utils/commonFunction'

const NewConference = () => {
    const start = new Date().setDate(new Date().getDate() + 1)
    const end = new Date(start).setDate(new Date(start).getDate() + 1)
    const history = useHistory()
    const showSnackbar = useSnackbar()
    const { createConference, notifyChairEmail, checkShortNameExisted } = useConference()
    const { getUserByEmail } = useUser()
    const [usersTable, setUserTable] = useState([])
    const [image, setImage] = useState({ file: null, src: null })
    const [fileName, setFileName] = useState('No selected File')
    const [invitedEmail, setInvitedEmail] = useState('')
    const [textField, setTextField] = useState({ fullName: '', shortName: '', city: '', websiteLink: '' })
    const [selectField, setSelectField] = useState('')
    const [dateField, setDateField] = useState({ startDate: null, endDate: null })
    const [tracks, setTracks] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [error, setError] = useState({
        fullName: false,
        shortName: false,
        city: false,
        startDate: false,
        endDate: false,
        chairs: false,
        file: false,
        email: false,
        country: false,
        websiteLink: false,
        tracks: false,
    })

    const [messageError, setMessageError] = useState({
        fullName: '',
        shortName: '',
        city: '',
        startDate: '',
        endDate: '',
        chairs: '',
        file: '',
        email: '',
        country: '',
        websiteLink: '',
        tracks: '',
    })

    const handleImageChange = (e) => {
        e.target.files[0] && setFileName(e.target.files[0].name)
        if (e.target.files[0]) {
            const imageUrl = URL.createObjectURL(e.target.files[0])
            const selectedFile = e.target.files[0]
            setImage({ file: selectedFile, src: imageUrl })
            setMessageError((prev) => ({ ...prev, ['file']: '' }))
            setError((prev) => ({ ...prev, ['file']: false }))
        }
    }

    const handleTextChange = (event) => {
        const { name, value } = event.target
        setTextField((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const resetImage = () => {
        setFileName('No selected File')
        setImage({ file: null, src: null })
    }

    const handleEmailInvited = (event) => {
        const { value } = event.target
        setInvitedEmail(value)
        setMessageError((prev) => ({ ...prev, ['email']: '' }))
        setError((prev) => ({ ...prev, ['email']: false }))
    }

    const handleDateChange = (value, name) => {
        const formatDate = moment(value).format()
        const date = formatDate.substring(0, 19)
        setDateField((prev) => ({ ...prev, [name]: date.toUpperCase() === 'INVALID DATE' ? null : value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleUsersTable = () => {
        setLoadingSearch(true)
        getUserByEmail(invitedEmail)
            .then((response) => {
                const user = response.data
                if (user) {
                    setMessageError((prev) => ({ ...prev, ['chairs']: '' }))
                    setError((prev) => ({ ...prev, ['chairs']: false }))
                    const alreadyAdded = usersTable.some((chair) => chair.id === user.id)
                    if (!alreadyAdded) {
                        setUserTable((prev) => [...prev, { ...user }])
                        setInvitedEmail('')
                    }
                } else {
                    setError((prev) => ({ ...prev, email: true }))
                    setMessageError((prev) => ({
                        ...prev,
                        email: 'User was not found. Email must belong to a registered this system account',
                    }))
                }
            })
            .finally(() => {
                setLoadingSearch(false)
            })
    }

    const handleSelectField = (newValue) => {
        setSelectField(newValue)
        setMessageError((prev) => ({ ...prev, ['country']: '' }))
        setError((prev) => ({ ...prev, ['country']: false }))
    }

    const removeUsersTable = (id) => {
        const newUsers = usersTable.filter((user) => user.id !== id)
        setUserTable(newUsers)
    }

    const submitConference = (event) => {
        event.preventDefault()
        const { fullName, shortName, city, websiteLink } = textField
        const { startDate, endDate } = dateField
        const formatTracks = tracks.map((track) => track.text)
        const chairs = usersTable.map((user) => user.id)
        const chairsEmail = usersTable.map((user) => user.email)

        const formatDate = moment(new Date()).format()
        const date = formatDate.substring(0, 10)
        const now = new Date(date)
        now.setHours(now.getHours() - 7)

        const isFullName = !isEmpty(fullName)
        const isShortName = !isEmpty(shortName)
        const isCity = !isEmpty(city)
        const isWebsiteLink = isEmpty(websiteLink) ? true : regexUrl.test(websiteLink)
        const isChair = usersTable.length > 0
        let isStartDate = !!startDate && startDate.toString() !== 'Invalid date'
        let isEndDate = !!endDate && endDate.toString() !== 'Invalid date'
        const isFile = image.file !== null
        const isCountry = !isEmpty(selectField)
        const isTracks = tracks.length !== 0 && checkDuplicated(formatTracks)

        if (startDate && endDate) {
            isStartDate = startDate.getTime() > now.getTime()
            isEndDate = endDate.getTime() > startDate.getTime()
        }

        const isValid =
            isFullName &&
            isShortName &&
            isCity &&
            isWebsiteLink &&
            isChair &&
            isStartDate &&
            isEndDate &&
            isFile &&
            isCountry &&
            isTracks

        if (!isValid) {
            setError({
                fullName: !isFullName,
                shortName: !isShortName,
                city: !isCity,
                websiteLink: !isWebsiteLink,
                startDate: !isStartDate,
                endDate: !isEndDate,
                chairs: !isChair,
                country: !isCountry,
                file: !isFile,
                tracks: !isTracks,
            })
            setMessageError({
                fullName: !isFullName ? 'Full name of conference must not be empty' : '',
                shortName: !isShortName ? 'Short name of conference must not be empty' : '',
                city: !isCity ? 'City must not be empty' : '',
                websiteLink: !isWebsiteLink ? 'Invalid url' : '',
                startDate:
                    !isStartDate && startDate?.getTime() <= now.getTime()
                        ? 'Start date must be after current date'
                        : 'Invalid date',
                endDate:
                    !isEndDate && endDate?.getTime() <= startDate?.getTime()
                        ? 'End date must be after start date'
                        : 'Invalid date',
                chairs: !isChair ? 'At least one chair is required' : '',
                country: !isCountry ? 'Country must be selected' : '',
                file: !isFile ? 'Conference logo is required' : '',
                tracks:
                    !isTracks && !checkDuplicated(formatTracks)
                        ? 'Track name must not be duplicated'
                        : 'Conference must has at least one track',
            })
        } else {
            setLoading(true)
            let fileType = image.file.type.replace('image/', '')
            const storageRef = getStorageRef(storage, `images/${image.file.name + uuid()}.${fileType}`)
            const uploadTask = uploadBytesResumable(storageRef, image.file)
            uploadTask.on(
                'state_changed',
                () => {},
                () => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, cannot upload event poster.',
                    })
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            const formatDate = moment(startDate).format()
                            const startDateFormat = formatDate.substring(0, 19)
                            const formatEndDate = moment(endDate).format()
                            const endDateFormat = formatEndDate.substring(0, 19)
                            const conferenceInfo = {
                                fullName,
                                shortName,
                                city,
                                websiteLink,
                                startDate: startDateFormat,
                                endDate: endDateFormat,
                                country: selectField,
                                isSingleTrack: false,
                                logo: downloadURL,
                                tracks: formatTracks,
                                chairs,
                            }
                            const conferenceCreate = createConference(conferenceInfo)
                            const notifyEmail = notifyChairEmail({
                                emails: chairsEmail,
                                conferenceName: fullName,
                                shortNameConference: shortName,
                            })
                            Promise.all([conferenceCreate, notifyEmail])
                                .then(() => {
                                    history.push('/conferences')
                                    //showSnackbar({ severity: 'success', children: 'Create conference successfully' })
                                })
                                .catch(() => {
                                    showSnackbar({
                                        severity: 'error',
                                        children: 'Something went wrong, please try again later!',
                                    })
                                })
                                .finally(() => {
                                    setLoading(false)
                                })
                        })
                        .catch(() => {
                            setLoading(false)
                        })
                }
            )
        }
    }

    useEffect(() => {
        return () => {
            image && URL.revokeObjectURL(image.src)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image.src])

    useEffect(() => {
        const controller = new AbortController()
        const timeout = setTimeout(() => {
            checkShortNameExisted(textField.shortName, controller.signal).then((response) => {
                const isExisted = response.data.isShortNameExisting
                if (isExisted) {
                    setError((prev) => ({ ...prev, shortName: true }))
                    setMessageError((prev) => ({ ...prev, shortName: 'Conference short name has already existed' }))
                }
            })
        }, 1000)
        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textField.shortName])

    return (
        <React.Fragment>
            <Header />
            <Container maxWidth="lg">
                <Typography fontWeight={600} mt={3} variant="h5">
                    New Conference
                </Typography>
                <Box>
                    <RequireDetails
                        textField={textField}
                        handleTextChange={handleTextChange}
                        handleDateChange={handleDateChange}
                        dateField={dateField}
                        handleSelectField={handleSelectField}
                        selectField={selectField}
                        error={error}
                        messageError={messageError}
                        start={start}
                        end={end}
                    />

                    <Chairs
                        rows={usersTable}
                        error={error}
                        messageError={messageError}
                        removeUsersTable={removeUsersTable}
                    />
                    <Box mt={2} mb={3}>
                        <Box width="50%" display="flex">
                            <TextField
                                size="small"
                                variant="outlined"
                                fullWidth
                                placeholder="Email"
                                onChange={handleEmailInvited}
                                value={invitedEmail}
                            />
                            <LoadingButton
                                loadingPosition="start"
                                loading={loadingSearch}
                                variant="contained"
                                disabled={loadingSearch}
                                size="small"
                                startIcon={<Add />}
                                sx={{ ml: 2 }}
                                onClick={handleUsersTable}
                            >
                                Add
                            </LoadingButton>
                        </Box>
                        {error.email && (
                            <Typography variant="subtitle2" mt={1} sx={{ color: '#f39f0e' }}>
                                {messageError.email}
                            </Typography>
                        )}
                    </Box>
                    <TrackManagement
                        tracks={tracks}
                        setTracks={setTracks}
                        error={error}
                        messageError={messageError}
                        setMessageError={setMessageError}
                        setError={setError}
                    />
                    <ConferenceLogo
                        handleImageChange={handleImageChange}
                        image={image}
                        resetImage={resetImage}
                        fileName={fileName}
                        error={error}
                        messageError={messageError}
                        setMessageError={setMessageError}
                        setError={setError}
                        setImage={setImage}
                        setFileName={setFileName}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                            onClick={() => history.push('/conferences')}
                            variant="contained"
                            color="error"
                            sx={{ mr: 2 }}
                        >
                            Go Back
                        </Button>
                        <LoadingButton
                            onClick={submitConference}
                            startIcon={<Add />}
                            loadingPosition="start"
                            loading={loading}
                            disabled={loading}
                            variant="contained"
                            type="submit"
                        >
                            Create Conference
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default NewConference
