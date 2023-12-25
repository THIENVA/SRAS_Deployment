import { useEffect, useRef, useState } from 'react'

import axios from 'axios'
import JSZip from 'jszip'
import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Save } from '@mui/icons-material'
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
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useTrack } from '~/api/common/track'
import { APP_API_URL } from '~/config'
import { SHOW_AS, TYPES } from '~/constants/SubmissionQuestionsConstant'
import { AppStyles } from '~/constants/colors'
import { isEmpty } from '~/utils/commonFunction'

const UpdatePaperSubmission = () => {
    const { getSubmissionSummary } = usePaperSubmission()
    const history = useHistory()
    const { conferenceId, submissionId, trackId } = useParams()
    const { createFilesForPaper, updatePaperSubmission, getTrackNameById } = usePaperSubmission()
    const { getSubmissionSettings, getInstructionSettings } = useTrack()
    const showSnackbar = useSnackbar()
    const [titleAbstract, setTitleAbstract] = useState({ title: '', abstract: '' })
    const [settings, setSettings] = useState({ instruction: '', config: null })
    const [authors, setAuthors] = useState([])
    const [domain, setDomain] = useState('')
    const [subjectAreas, setSubjectAreas] = useState([])
    const [questions, setQuestions] = useState([])
    const [filesAttached, setFilesAttached] = useState([])
    const [isDisable, setDisable] = useState(false)
    const [loading, setLoading] = useState(true)
    const formRef = useRef(null)
    const [trackName, setTrackName] = useState('')
    const [error, setError] = useState({
        title: false,
        domain: false,
        filesAttached: false,
        questions: false,
    })

    const [messageError, setMessageError] = useState({
        title: '',
        domain: '',
        filesAttached: '',
        questions: '',
    })

    const handleAddAuthor = (author) => {
        setAuthors((prev) => [...prev, author])
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
        const isValid = isTitle && isDomain && isFiles && !isQuestionError
        if (!isValid) {
            setError({
                title: !isTitle,
                domain: !isDomain,
                filesAttached: !isFiles,
                questions: isQuestionError,
            })
            setMessageError({
                title: !isTitle ? 'Title must not be empty' : '',
                domain: !isDomain ? 'Domain conflict is required' : '',
                filesAttached:
                    !isFiles && filesAttached.length === 0
                        ? 'At least one file is required'
                        : settings.config && filesAttached.length < settings.config.submissionFileSettings[1].value
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
                title,
                abstract,
                domainConflicts: domain,
                subjectAreas: formatSubjectAreas,
                authors: formatAuthors,
                answers: questions,
            }

            updatePaperSubmission(submissionId, submission)
                .then((response) => {
                    const paperId = response.data
                    const formData = new FormData()
                    filesAttached.forEach((file) => formData.append('files', file.file))
                    createFilesForPaper(paperId, formData)
                        .then(() => {
                            history.push(`/conferences/${conferenceId}/submission-summary/${paperId}`)
                            // showSnackbar({
                            //     severity: 'success',
                            //     children: 'Update submission successfully',
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
        const thirdController = new AbortController()
        const fourthController = new AbortController()
        const submissionSettings = getSubmissionSettings(trackId, thirdController.signal)
        const instructionGet = getInstructionSettings(trackId, fourthController.signal)
        const submissionGet = getSubmissionSummary(submissionId, controller.signal)
        Promise.all([submissionGet, submissionSettings, instructionGet])
            .then((response) => {
                const submissionSummary = response[0].data
                const {
                    title,
                    abstract,
                    authors: summaryAuthors,
                    subjectAreas: summarySubjectAreas,
                    domainConflicts: summaryDomainConflicts,
                    submissionQuestionsResponse,
                } = submissionSummary
                const formatAuthors = summaryAuthors.map((author) => {
                    if (author.hasAccount) {
                        return {
                            firstName: author.firstName,
                            middleName: author.middleName,
                            lastName: author.lastName,
                            organization: author.authorOrganization,
                            country: author.country,
                            email: author.authorEmail,
                            isPrimaryContact: author.isPrimaryContact,
                            enablePrimary: true,
                            pariticipantId: author.participantId,
                            hasAccount: author.hasAccount,
                            isFirstAuthor: author.isFirstAuthor,
                            isCorrespondingAuthor: author.isCorrespondingAuthor,
                        }
                    } else {
                        return {
                            firstName: author.firstName,
                            middleName: author.middleName,
                            lastName: author.lastName,
                            organization: author.authorOrganization,
                            country: author.country,
                            email: author.authorEmail,
                            isPrimaryContact: author.isPrimaryContact,
                            enablePrimary: false,
                            pariticipantId: author.participantId,
                            hasAccount: author.hasAccount,
                            isFirstAuthor: author.isFirstAuthor,
                            isCorrespondingAuthor: author.isCorrespondingAuthor,
                        }
                    }
                })
                if (summarySubjectAreas) {
                    const formatSubjectArea = summarySubjectAreas.map((item) => {
                        if (item.isPrimary) {
                            return {
                                id: item.subjectAreaId,
                                name: item.subjectAreaName,
                                primaryChecked: item.isPrimary,
                                secondaryChecked: false,
                            }
                        } else {
                            return {
                                id: item.subjectAreaId,
                                name: item.subjectAreaName,
                                primaryChecked: false,
                                secondaryChecked: true,
                            }
                        }
                    })
                    setSubjectAreas(formatSubjectArea)
                }
                setTitleAbstract({ title, abstract })
                setAuthors(formatAuthors)
                setDomain(summaryDomainConflicts)
                setQuestions(submissionQuestionsResponse ? JSON.parse(submissionQuestionsResponse) : [])
                setSettings({ instruction: response[2].data, config: response[1].data })
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

        return () => {
            controller.abort()
            thirdController.abort()
            fourthController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        axios({
            url: `${APP_API_URL}/submissions/${submissionId}/submission-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                if (response.data.size) {
                    const zip = new JSZip()
                    return zip.loadAsync(response.data).then((zip) => {
                        const filesPromises = []
                        Object.keys(zip.files).forEach((filename) => {
                            const filePromise = zip.files[filename]
                                .async('blob')
                                .then((fileData) => {
                                    const newBlob = new Blob([fileData], { type: 'application/octet-stream' })
                                    return new File([newBlob], filename, { type: 'application/octet-stream' })
                                })
                                .catch(() => {
                                    return null
                                })
                            filesPromises.push(filePromise)
                        })

                        return Promise.all(filesPromises).then((files) => {
                            const formatFiles = files.map((file) => ({
                                name: file.name,
                                size: (file.size / 1024).toFixed(2),
                                date: new Date().toLocaleString(),
                                file,
                                id: uuid(),
                            }))
                            setFilesAttached(cloneDeep(formatFiles))
                            return files
                        })
                    })
                }
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    return (
        <ConferenceDetail>
            {loading ? (
                <Loading height="87.5vh" />
            ) : (
                <Container maxWidth="lg">
                    <Typography fontWeight={600} mt={1} variant="h5">
                        Update Paper Submission
                    </Typography>
                    <Box display="flex" sx={{ mt: 1 }}>
                        <Typography fontWeight={700} component="span">
                            Track:{' '}
                        </Typography>
                        <Typography component="span" ml={0.5}>
                            {trackName}
                            {/* {roleName === ROLES_NAME.CHAIR ? state?.trackName : getTrackName} */}
                        </Typography>
                    </Box>
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
                        handleFirstAuthor={handleFirstAuthor}
                        handleCorresponding={handleCorresponding}
                    />
                    <DomainConflict
                        handleDomainChange={handleDomainChange}
                        domain={domain}
                        error={error}
                        messageError={messageError}
                    />
                    <SubjectAreas subjectAreas={subjectAreas} handleSubjectAreas={handleSubjectAreas} />
                    <FilesAttached
                        filesAttached={filesAttached}
                        handleUploadFiles={handleUploadFiles}
                        handleDeleteFile={handleDeleteFile}
                        error={error}
                        messageError={messageError}
                        config={settings.config}
                        ref={formRef}
                    />
                    <AdditionalQuestions
                        questions={questions}
                        setQuestions={setQuestions}
                        setMessageError={setMessageError}
                        setError={setError}
                        error={error}
                        messageError={messageError}
                    />
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
                                onClick={() => history.goBack()}
                            >
                                Go Back
                            </Button>
                            <LoadingButton
                                onClick={handleSubmit}
                                variant="contained"
                                disabled={isDisable}
                                loading={isDisable}
                                loadingPosition="start"
                                startIcon={<Save />}
                                sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                            >
                                Save Changes
                            </LoadingButton>
                        </Container>
                    </Box>
                </Container>
            )}
        </ConferenceDetail>
    )
}

export default UpdatePaperSubmission
