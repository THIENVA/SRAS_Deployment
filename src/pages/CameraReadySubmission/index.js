import React, { useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import Authors from './Authors'
import CheckList from './CheckList'
import CopyRightFiles from './CopyRightFiles'
import FilesAttached from './FilesAttached'
import TitleAbstract from './TitleAbstract'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useCopyRight from '~/api/common/copy-right'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const UploadRevision = () => {
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { conferenceId, submissionId, trackId } = useParams()
    const { getSubmissionSummary, createCameraReady, createCameraReadySubmissionFiles } = usePaperSubmission()
    const { createCopyRightFiles } = useCopyRight()
    const { getDecisionCheckList } = useTrack()
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const [copyRightFiles, setCopyRightFiles] = useState([])
    const [generalInfo, setGeneralInfo] = useState(null)
    const [filesAttached, setFilesAttached] = useState([])
    const [isDisable, setDisable] = useState(false)
    const [isLoading, setButtonLoading] = useState(false)
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [titleAbstract, setTitleAbstract] = useState({
        title: '',
        abstract: '',
    })
    const { getCameraReadySetting } = useTrack()
    const [authors, setAuthors] = useState([])
    const [listChecked, setListChecked] = useState([])
    const [settings, setSettings] = useState(null)
    const formRef = useRef(null)
    const copyRightFormRef = useRef(null)

    const handleAddAuthor = (author) => {
        setAuthors((prev) => [...prev, author])
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

    const handleTitleAbstractChange = (event) => {
        const { value, name } = event.target
        setTitleAbstract((prev) => ({ ...prev, [name]: value }))
    }

    const handleUploadFiles = (event) => {
        const file = event.target.files[0]
        if (file) {
            const fileSizeKb = (file.size / 1024).toFixed(2)
            const maximumSize = settings ? settings.cameraReadyFileSetting[2].value * 1024 : null
            if (maximumSize && fileSizeKb > maximumSize) {
                showSnackbar({
                    severity: 'error',
                    children: 'The file has exceeded the maximum size, please import again.',
                })
            } else {
                if (filesAttached.length === 0) {
                    const fileName = file.name
                    const dateUploaded = new Date().toLocaleString()
                    const newId = uuid()
                    const newFile = { id: newId, name: fileName, size: fileSizeKb, date: dateUploaded }
                    setFilesAttached((prev) => [...prev, newFile])
                    setFiles((prev) => [...prev, { id: newId, file: file }])
                } else {
                    const filePosition = filesAttached.findIndex((fileItem) => fileItem.name === file.name)
                    if (filePosition === -1) {
                        const fileName = file.name
                        const dateUploaded = new Date().toLocaleString()
                        const newId = uuid()
                        const newFile = { id: newId, name: fileName, size: fileSizeKb, date: dateUploaded }
                        setFilesAttached((prev) => [...prev, newFile])
                        setFiles((prev) => [...prev, { id: newId, file: file }])
                    } else {
                        showSnackbar({
                            severity: 'error',
                            children: 'This file has been added, please add another file.',
                        })
                    }
                }
                formRef.current.reset()
            }
        }
    }

    const handleUploadCopyRightFiles = (event) => {
        const file = event.target.files[0]
        if (file) {
            const fileSizeKb = (file.size / 1024).toFixed(2)
            const maximumSize = settings ? settings.copyRightFileSetting[1].value * 1024 : null
            if (maximumSize && fileSizeKb > maximumSize) {
                showSnackbar({
                    severity: 'error',
                    children: 'The file has exceeded the maximum size, please import again.',
                })
            } else {
                if (copyRightFiles.length === 0) {
                    const fileSizeKb = (file.size / 1024).toFixed(2)
                    const fileName = file.name
                    const dateUploaded = new Date().toLocaleString()
                    const newId = uuid()
                    const newFile = { id: newId, name: fileName, size: fileSizeKb, date: dateUploaded, file: file }
                    setCopyRightFiles((prev) => [...prev, newFile])
                }
            }
            copyRightFormRef.current.reset()
        }
    }

    const handleDeleteCopyRightFiles = (id) => {
        const updatedFiles = copyRightFiles.filter((file) => file.id !== id)
        setCopyRightFiles(updatedFiles)
    }

    const handleDeleteFile = (id) => {
        const updatedFiles = filesAttached.filter((file) => file.id !== id)
        const updatedFilesUpload = files.filter((file) => file.id !== id)
        setFilesAttached(updatedFiles)
        setFiles(updatedFilesUpload)
    }

    const handleSubmitRevisions = () => {
        setButtonLoading(true)
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
        const formData = new FormData()
        const copyRightFormData = new FormData()
        files.forEach((file) => formData.append('files', file.file))
        copyRightFiles.forEach((file) => copyRightFormData.append('file', file.file))
        const body = {
            title: titleAbstract.title,
            abstract: titleAbstract.abstract,
            authors: formatAuthors,
            answers: listChecked,
        }

        createCameraReady(submissionId, body)
            .then((res) => {
                if (res.data.isSuccess === true) {
                    createCameraReadySubmissionFiles(submissionId, formData).then(() => {
                        createCopyRightFiles(submissionId, copyRightFormData).then(() => {
                            handleGoBack()
                        })
                    })
                } else {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, cannot create camera ready.',
                    })
                }
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, cannot create camera ready.',
                })
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    const handleGoBack = () => {
        if (roleName === ROLES_NAME.AUTHOR) {
            history.push(`/conferences/${conferenceId}/submission/author`)
        } else if (roleName === ROLES_NAME.CHAIR || roleName === ROLES_NAME.TRACK_CHAIR)
            history.push(`/conferences/${conferenceId}/manuscript`)
    }

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)

        if (trackId) {
            getCameraReadySetting(trackId, controller.signal)
                .then((response) => {
                    const cameraReadySetting = response.data
                    if (cameraReadySetting) {
                        const cameraReadyFileSetting = cameraReadySetting.result.cameraReadyFileSettings
                        const copyRightFileSetting = cameraReadySetting.result.copyRightFileSettings
                        setSettings({ cameraReadyFileSetting, copyRightFileSetting })
                    }
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later.',
                    })
                })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackId])

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()

        const summaryGet = getSubmissionSummary(submissionId, controller.signal)
        const checkListGet = getDecisionCheckList(trackId, secondController.signal)

        Promise.all([summaryGet, checkListGet])
            .then((response) => {
                const data = response[0].data
                const getCheckList = response[1].data
                const modifiedData = data.authors.map((obj) => {
                    if (obj.hasAccount) {
                        return {
                            firstName: obj.firstName,
                            middleName: obj.middleName,
                            lastName: obj.lastName,
                            organization: obj.authorOrganization,
                            country: obj.country,
                            email: obj.authorEmail,
                            isPrimaryContact: obj.isPrimaryContact,
                            enablePrimary: true,
                            pariticipantId: obj.participantId,
                            hasAccount: obj.hasAccount,
                            isFirstAuthor: obj.isFirstAuthor,
                            isCorrespondingAuthor: obj.isCorrespondingAuthor,
                        }
                    } else {
                        return {
                            firstName: obj.firstName,
                            middleName: obj.middleName,
                            lastName: obj.lastName,
                            organization: obj.authorOrganization,
                            country: obj.country,
                            email: obj.authorEmail,
                            isPrimaryContact: obj.isPrimaryContact,
                            enablePrimary: false,
                            pariticipantId: obj.participantId,
                            hasAccount: obj.hasAccount,
                            isFirstAuthor: obj.isFirstAuthor,
                            isCorrespondingAuthor: obj.isCorrespondingAuthor,
                        }
                    }
                })
                setListChecked(getCheckList ? getCheckList : [])
                setTitleAbstract({ title: data.title, abstract: data.abstract })
                setAuthors(modifiedData)
                setGeneralInfo(data)
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

        return () => {
            controller.abort()
            secondController.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const isCheckAll = listChecked.some((item) => item.isChecked === false)
        const isFiles =
            !settings && filesAttached.length < settings?.cameraReadyFileSetting[1]?.value
                ? false
                : filesAttached.length >= settings?.cameraReadyFileSetting[1]?.value
        if (
            files.length === 0 ||
            authors.length === 0 ||
            isCheckAll === true ||
            !titleAbstract.title ||
            !titleAbstract.abstract ||
            !isFiles
        ) {
            setDisable(true)
        } else {
            setDisable(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titleAbstract.title, titleAbstract.abstract, authors, listChecked, files, settings])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Typography fontWeight={600} mt={3} variant="h5" mb={2}>
                    Create Camera Ready Submission
                </Typography>
                {loading ? (
                    <Box maxWidth={500}>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </Box>
                ) : (
                    <Grid container columnSpacing={2}>
                        <Grid item lg={3}>
                            <Typography fontWeight={700}>Paper ID</Typography>
                            <Typography fontWeight={700}>Track</Typography>
                        </Grid>
                        <Grid item lg={9}>
                            <IDField id={generalInfo?.paperId} showButton={true} />
                            <Typography>{generalInfo?.trackName}</Typography>
                        </Grid>
                    </Grid>
                )}
                {loading ? (
                    <Loading height="80vh" />
                ) : (
                    <React.Fragment>
                        <TitleAbstract
                            roleName={roleName}
                            titleAbstract={titleAbstract}
                            handleTitleAbstractChange={handleTitleAbstractChange}
                        />
                        <Authors
                            authors={authors}
                            roleName={roleName}
                            handleAddAuthor={handleAddAuthor}
                            handleRemoveAuthor={handleRemoveAuthor}
                            handlePrimaryAuthor={handlePrimaryAuthor}
                            handleFirstAuthor={handleFirstAuthor}
                            handleCorresponding={handleCorresponding}
                        />
                        {listChecked.length !== 0 && (
                            <CheckList listChecked={listChecked} setListChecked={setListChecked} />
                        )}
                        <FilesAttached
                            filesAttached={filesAttached}
                            handleUploadFiles={handleUploadFiles}
                            handleDeleteFile={handleDeleteFile}
                            config={settings}
                            ref={formRef}
                        />
                        <CopyRightFiles
                            filesAttached={copyRightFiles}
                            handleUploadFiles={handleUploadCopyRightFiles}
                            handleDeleteFile={handleDeleteCopyRightFiles}
                            config={settings}
                            ref={copyRightFormRef}
                        />
                        <Box
                            sx={{
                                mt: 4,
                                px: 2,
                                py: 2,
                                boxShadow: 'inset 0 -1px 0 #edeeef',
                                backgroundColor: AppStyles.colors['#F8F9FA'],
                                display: 'flex',
                            }}
                        >
                            <Box ml={6}>
                                <Button
                                    color="error"
                                    variant="contained"
                                    sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                                    onClick={() => handleGoBack()}
                                >
                                    Go Back
                                </Button>
                            </Box>
                            <Box ml={4}>
                                <LoadingButton
                                    sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                                    variant="contained"
                                    onClick={handleSubmitRevisions}
                                    disabled={isDisable}
                                    loading={isLoading}
                                    loadingPosition="start"
                                    startIcon={<Add />}
                                >
                                    Submit Camera Ready
                                </LoadingButton>
                            </Box>
                        </Box>
                    </React.Fragment>
                )}
            </Container>
        </ConferenceDetail>
    )
}

export default UploadRevision
