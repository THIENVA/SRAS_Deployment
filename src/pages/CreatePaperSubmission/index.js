import { useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Typography } from '@mui/material'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import AdditionalQuestions from './AdditionalQuestion'
import Authors from './Authors'
import DomainConflict from './DomainConflict'
import FilesAttached from './FilesAttached'
import SubjectAreas from './SubjectAreas'
import TitleAbstract from './TitleAbstract'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useOutsider } from '~/api/common/outsider'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useSubjectArea } from '~/api/common/subjectArea'
import { useTrack } from '~/api/common/track'
import { SHOW_AS, TYPES } from '~/constants/SubmissionQuestionsConstant'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import { isEmpty } from '~/utils/commonFunction'

const CreatePaperSubmission = () => {
    const {
        roleConference: { roleName },
        trackConference: { trackId: getTrackId },
    } = useAppSelector((state) => state.conference)
    const history = useHistory()
    const { conferenceId, trackId } = useParams()
    const { searchParticipantByEmail } = useOutsider()
    const { getSubjectAreas } = useSubjectArea()
    const { createFilesForPaper, createPaperSubmission, getSubmissionQuestions, getTrackNameById } =
        usePaperSubmission()
    const { getSubmissionSettings, getInstructionSettings } = useTrack()
    const [settings, setSettings] = useState({ instruction: '', config: null })
    const showSnackbar = useSnackbar()
    const [titleAbstract, setTitleAbstract] = useState({ title: '', abstract: '' })
    const [authors, setAuthors] = useState([])
    const [domain, setDomain] = useState('')
    const [subjectAreas, setSubjectAreas] = useState([])
    const [questions, setQuestions] = useState([])
    const [filesAttached, setFilesAttached] = useState([])
    const [isDisable, setDisable] = useState(false)
    const { email } = useAppSelector((state) => state.auth)
    const [loading, setLoading] = useState(true)
    const [trackName, setTrackName] = useState('')
    const formRef = useRef(null)
    const [error, setError] = useState({
        title: false,
        authors: false,
        domain: false,
        subjectAreas: false,
        filesAttached: false,
        questions: false,
    })

    const [messageError, setMessageError] = useState({
        title: '',
        authors: '',
        domain: '',
        subjectAreas: '',
        filesAttached: '',
        questions: '',
    })

    const handleAddAuthor = (author) => {
        setAuthors((prev) => [...prev, author])
        setMessageError((prev) => ({ ...prev, ['authors']: '' }))
        setError((prev) => ({ ...prev, ['authors']: false }))
    }

    const handleTitleAbstractChange = (event) => {
        const { value, name } = event.target
        setTitleAbstract((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleDomainChange = (event) => {
        const { value } = event.target
        setDomain(value)
        setMessageError((prev) => ({ ...prev, ['domain']: '' }))
        setError((prev) => ({ ...prev, ['domain']: false }))
    }

    const handleFirstAuthor = (index) => {
        const updatedAuthors = authors.map((author) => {
            author.isFirstAuthor = false
            return author
        })
        updatedAuthors[index].isFirstAuthor = true
        const cloneUpdatedAuthors = cloneDeep(updatedAuthors)
        setAuthors(cloneUpdatedAuthors)
    }

    const handleCorresponding = (index) => {
        const updatedAuthors = cloneDeep(authors)
        updatedAuthors[index].isCorrespondingAuthor = !updatedAuthors[index].isCorrespondingAuthor
        setAuthors(updatedAuthors)
    }

    const handleRemoveAuthor = (id) => {
        const updatedAuthors = authors.filter((author) => author.pariticipantId !== id)
        setAuthors(updatedAuthors)
    }

    const handlePrimaryAuthor = (index) => {
        const updatedAuthors = authors.map((author) => {
            author.isPrimaryContact = false
            return author
        })
        updatedAuthors[index].isPrimaryContact = true
        const cloneUpdatedAuthors = cloneDeep(updatedAuthors)
        setAuthors(cloneUpdatedAuthors)
    }

    const handleSubjectAreas = (event, id, type, index) => {
        if (type === 'primary') {
            const updatedSubjectAreas = subjectAreas.map((item) => ({
                ...item,
                primaryChecked: item.id === id,
            }))
            const cloneUpdatedSubjectAreas = cloneDeep(updatedSubjectAreas)
            cloneUpdatedSubjectAreas[index].secondaryChecked = false
            setSubjectAreas(cloneUpdatedSubjectAreas)
        } else if (type === 'secondary') {
            const cloneUpdatedSubjectAreas = cloneDeep(subjectAreas)
            if (cloneUpdatedSubjectAreas[index].primaryChecked === false) {
                cloneUpdatedSubjectAreas[index].secondaryChecked = event.target.checked
            }
            setSubjectAreas(cloneUpdatedSubjectAreas)
        }
        setMessageError((prev) => ({ ...prev, ['subjectAreas']: '' }))
        setError((prev) => ({ ...prev, ['subjectAreas']: false }))
    }

    const handleUploadFiles = (event) => {
        const file = event.target.files[0]
        if (file) {
            const fileSizeKb = (file.size / 1024).toFixed(2)
            const maximumSize = settings.config ? settings.config.submissionFileSettings[3].value * 1024 : null
            if (maximumSize && fileSizeKb > maximumSize) {
                showSnackbar({
                    severity: 'error',
                    children: 'The file has exceeded the maximum size, please import again.',
                })
            } else {
                if (filesAttached.length === 0) {
                    const fileName = file.name
                    const dateUploaded = new Date().toLocaleString()
                    const newFile = { id: uuid(), name: fileName, size: fileSizeKb, date: dateUploaded, file: file }
                    setFilesAttached((prev) => [...prev, newFile])
                } else {
                    const filePosition = filesAttached.findIndex((fileItem) => fileItem.name === file.name)
                    if (filePosition === -1) {
                        const fileSizeKb = (file.size / 1024).toFixed(2)
                        const fileName = file.name
                        const dateUploaded = new Date().toLocaleString()
                        const newFile = {
                            id: uuid(),
                            name: fileName,
                            size: fileSizeKb,
                            date: dateUploaded,
                            file: file,
                        }
                        setFilesAttached((prev) => [...prev, newFile])
                    } else {
                        showSnackbar({
                            severity: 'error',
                            children: 'This file has been added, please add another file',
                        })
                    }
                }
                setMessageError((prev) => ({ ...prev, ['filesAttached']: '' }))
                setError((prev) => ({ ...prev, ['filesAttached']: false }))
            }
            formRef.current.reset()
        }
    }

    const handleDeleteFile = (id) => {
        const updatedFiles = filesAttached.filter((file) => file.id !== id)
        setFilesAttached(updatedFiles)
    }

    const handleSubmit = () => {
        const isTitle = !isEmpty(titleAbstract.title)
        const isAuthors = authors.length !== 0 && authors.some((author) => author.isPrimaryContact === true)
        const isSubjectAreas =
            subjectAreas.length !== 0 && subjectAreas.some((subjectArea) => subjectArea.primaryChecked === true)
        const isDomain = !isEmpty(domain)
        const isFiles =
            !settings.config && filesAttached.length < settings.config?.submissionFileSettings[1].value
                ? false
                : filesAttached.length >= settings.config?.submissionFileSettings[1].value
        const isQuestionError = questions.some((question) => {
            if (question.isRequired) {
                if (question.typeName === TYPES.AGREEMENT) {
                    if (question.showAs.result.valueInput === false) {
                        return true
                    } else return false
                } else if (question.typeName === TYPES.COMMENT) {
                    if (isEmpty(question.showAs.result.valueInput)) {
                        return true
                    } else return false
                } else if (question.typeName === TYPES.OPTIONS) {
                    if (question.showAs.result.render === SHOW_AS.RADIO) {
                        if (isEmpty(question.showAs.result.valueInput)) {
                            return true
                        } else return false
                    } else if (question.showAs.result.render === SHOW_AS.CHECKBOX) {
                        if (question.showAs.result.valueInput.length === 0) {
                            return true
                        } else return false
                    } else if (question.showAs.result.render === SHOW_AS.SELECT_ONE) {
                        if (isEmpty(question.showAs.result.valueInput)) {
                            return true
                        } else return false
                    } else if (question.showAs.result.render === SHOW_AS.SELECT_MULTIPLE) {
                        if (question.showAs.result.valueInput.length === 0) {
                            return true
                        } else return false
                    }
                }
            } else {
                return false
            }
        })
        const isValid = isTitle && isAuthors && isSubjectAreas && isDomain && isFiles && !isQuestionError
        if (!isValid) {
            setError({
                title: !isTitle,
                authors: !isAuthors,
                subjectAreas: !isSubjectAreas,
                domain: !isDomain,
                filesAttached: !isFiles,
                questions: isQuestionError,
            })
            setMessageError({
                title: !isTitle ? 'Title must not be empty' : '',
                authors: !isAuthors ? 'Primary author is required' : '',
                subjectAreas: !isSubjectAreas ? 'Primary subject area is required' : '',
                domain: !isDomain ? 'Domain conflict is required' : '',
                filesAttached:
                    !isFiles && filesAttached.length === 0
                        ? 'At least one file is required'
                        : filesAttached.length < settings.config?.submissionFileSettings[1].value
                        ? 'The files is less than minimum files required'
                        : '',
                questions: isQuestionError ? 'There are left questions answered yet' : '',
            })
        } else {
            setDisable(true)
            const { title, abstract } = titleAbstract
            const filterSubjectArea = subjectAreas.filter(
                (subject) => subject.secondaryChecked !== false || subject.primaryChecked !== false
            )
            const formatSubjectAreas = filterSubjectArea.map((subjectArea) => ({
                subjectAreaId: subjectArea.id,
                isPrimary: subjectArea.primaryChecked,
            }))

            let formatAuthors = authors.map((author) => ({
                participantId: author.pariticipantId,
                isPrimaryContact: author.isPrimaryContact,
                isFirstAuthor: author.isFirstAuthor,
                isCorrespondingAuthor: author.isCorrespondingAuthor,
            }))
            const hasCorrespondingAuthor = formatAuthors.some((author) => author.isCorrespondingAuthor === true)
            if (!hasCorrespondingAuthor) {
                formatAuthors = formatAuthors.map((author) => {
                    if (author.isFirstAuthor) {
                        author.isCorrespondingAuthor = true
                    }
                    return author
                })
            }
            const submission = {
                trackId,
                title,
                abstract,
                domainConflicts: domain,
                subjectAreas: formatSubjectAreas,
                authors: formatAuthors,
                answers: questions,
            }

            createPaperSubmission(submission)
                .then((response) => {
                    const paperId = response.data
                    const formData = new FormData()
                    filesAttached.forEach((file) => formData.append('files', file.file))
                    createFilesForPaper(paperId, formData)
                        .then(() => {
                            history.push(`/conferences/${conferenceId}/submission-summary/${paperId}`)
                            // showSnackbar({
                            //     severity: 'success',
                            //     children: 'Create submission successfully',
                            // })
                        })
                        .catch(() => {
                            showSnackbar({
                                severity: 'error',
                                children: 'Something went wrong, cannot upload question image.',
                            })
                        })
                        .finally(() => {
                            setDisable(false)
                        })
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        showSnackbar({
                            severity: 'error',
                            children: 'This paper already existed.',
                        })
                    }
                })
                .finally(() => {
                    setDisable(false)
                })
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const thirdController = new AbortController()
        const fourthController = new AbortController()
        const submissionQuestionsGet = getSubmissionQuestions(trackId, secondController.signal)
        const instructionGet = getInstructionSettings(trackId, fourthController.signal)
        if (roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR) {
            const submissionSettings = getSubmissionSettings(trackId, thirdController.signal)
            const subjectAreasGet = getSubjectAreas(trackId, controller.signal)
            Promise.all([subjectAreasGet, submissionQuestionsGet, submissionSettings, instructionGet])
                .then((response) => {
                    let formatSubjectAreas = []
                    if (response[0].data) {
                        formatSubjectAreas = response[0].data.map((subjectArea) => {
                            subjectArea.primaryChecked = false
                            subjectArea.secondaryChecked = false
                            return subjectArea
                        })
                    }
                    const questions = response[1].data
                    setSettings({ instruction: response[3].data, config: response[2].data })
                    setQuestions(questions ? questions : [])
                    setSubjectAreas(cloneDeep(formatSubjectAreas))
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later!.',
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        } else if (roleName === ROLES_NAME.AUTHOR) {
            const emailGet = searchParticipantByEmail(email)
            const subjectAreasGet = getSubjectAreas(trackId, controller.signal)
            const submissionSettings = getSubmissionSettings(trackId, thirdController.signal)
            Promise.all([subjectAreasGet, emailGet, submissionQuestionsGet, submissionSettings, instructionGet])
                .then((response) => {
                    let formatSubjectAreas = new Array()
                    if (response[0].data) {
                        formatSubjectAreas = response[0].data.map((subjectArea) => {
                            subjectArea.primaryChecked = false
                            subjectArea.secondaryChecked = false
                            return subjectArea
                        })
                    }
                    setSettings({ instruction: response[4].data, config: response[3].data })
                    const user = response[1].data
                    const questions = response[2].data
                    const cloneUser = cloneDeep(user)
                    cloneUser.isPrimaryContact = true
                    cloneUser.enablePrimary = true
                    setQuestions(questions ? questions : [])
                    setSubjectAreas(cloneDeep(formatSubjectAreas))
                    handleAddAuthor(cloneUser)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later!.',
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        return () => {
            controller.abort()
            secondController.abort()
            thirdController.abort()
            fourthController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleName, trackId])

    useEffect(() => {
        if (roleName === ROLES_NAME.TRACK_CHAIR) {
            history.push(`/conferences/${conferenceId}/submission/${getTrackId}/create-new-paper`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTrackId])

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        if (trackId) {
            getTrackNameById(trackId, signal)
                .then((response) => {
                    const data = response.data
                    setTrackName(data)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later.',
                    })
                })

            return () => {
                controller.abort()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackId])

    const handleGoBack = () => {
        if (roleName === ROLES_NAME.AUTHOR) {
            history.push(`/conferences/${conferenceId}/submission/author`)
        } else history.push(`/conferences/${conferenceId}/submission/submission-console`)
    }

    return (
        <ConferenceDetail>
            {loading ? (
                <Loading height="87.5vh" />
            ) : (
                <Container maxWidth="lg">
                    <Typography fontWeight={600} mt={1} variant="h5">
                        Create New Paper
                    </Typography>
                    <Box display="flex" sx={{ mt: 1 }}>
                        <Typography fontWeight={700} component="span">
                            Track:{' '}
                        </Typography>
                        <Typography component="span" ml={0.5}>
                            {trackName}
                        </Typography>
                    </Box>
                    {settings.instruction && (
                        <Box
                            sx={{
                                borderRadius: 2,
                                p: 2,
                                my: 1,
                                mb: 3,
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                border: '0.5px solid #cecdcd',
                            }}
                        >
                            <Typography gutterBottom sx={{ fontSize: 16 }}>
                                {settings.instruction}
                            </Typography>
                        </Box>
                    )}
                    <TitleAbstract
                        titleAbstract={titleAbstract}
                        handleTitleAbstractChange={handleTitleAbstractChange}
                        error={error}
                        messageError={messageError}
                        config={settings.config}
                    />
                    <Authors
                        authors={authors}
                        handleAddAuthor={handleAddAuthor}
                        handleRemoveAuthor={handleRemoveAuthor}
                        handlePrimaryAuthor={handlePrimaryAuthor}
                        error={error}
                        messageError={messageError}
                        handleFirstAuthor={handleFirstAuthor}
                        handleCorresponding={handleCorresponding}
                    />
                    <DomainConflict
                        handleDomainChange={handleDomainChange}
                        domain={domain}
                        error={error}
                        messageError={messageError}
                    />
                    <SubjectAreas
                        error={error}
                        messageError={messageError}
                        subjectAreas={subjectAreas}
                        handleSubjectAreas={handleSubjectAreas}
                    />
                    <FilesAttached
                        error={error}
                        messageError={messageError}
                        filesAttached={filesAttached}
                        handleUploadFiles={handleUploadFiles}
                        handleDeleteFile={handleDeleteFile}
                        config={settings.config}
                        ref={formRef}
                    />
                    {questions.length !== 0 && (
                        <AdditionalQuestions
                            error={error}
                            messageError={messageError}
                            setMessageError={setMessageError}
                            setError={setError}
                            questions={questions}
                            setQuestions={setQuestions}
                        />
                    )}
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                    >
                        <Container maxWidth="lg">
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ textTransform: 'none', height: 36, mr: 2, fontWeight: 'bold' }}
                                onClick={() => handleGoBack()}
                            >
                                Go Back
                            </Button>
                            <LoadingButton
                                onClick={handleSubmit}
                                variant="contained"
                                disabled={isDisable}
                                loading={isDisable}
                                loadingPosition="start"
                                startIcon={<Add />}
                                sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                            >
                                Submit Paper
                            </LoadingButton>
                        </Container>
                    </Box>
                </Container>
            )}
        </ConferenceDetail>
    )
}

export default CreatePaperSubmission
