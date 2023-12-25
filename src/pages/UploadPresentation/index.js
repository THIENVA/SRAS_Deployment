import { useEffect, useRef, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Upload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import CheckPresenters from './CheckList'
import FilesAttached from './FilesAttached'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { usePaperSubmission } from '~/api/common/paper-submission'
import usePresentation from '~/api/common/presentation'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const UploadPresentation = () => {
    const { conferenceId, submissionId } = useParams()
    const { createPresentationFiles } = usePresentation()
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const formRef = useRef(null)
    const { getSubmissionInfo, getSubmissionSummary, createPresenters } = usePaperSubmission()
    const { getPresentationSetting } = useTrack()
    const [settings, setSettings] = useState(null)
    const [presenterIds, setPresenterIds] = useState([])
    const [authors, setAuthors] = useState([])
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const [generalInfo, setGeneralInfo] = useState(null)
    const [filesAttached, setFilesAttached] = useState([])
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleUploadFiles = (event) => {
        const file = event.target.files[0]
        if (file) {
            const fileSizeKb = (file.size / 1024).toFixed(2)
            const maximumSize = settings ? settings.presentationSetting[1].value * 1024 : null
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
                    const newFile = { id: newId, name: fileName, size: fileSizeKb, date: dateUploaded, file: file }
                    setFilesAttached((prev) => [...prev, newFile])
                } else {
                    const filePosition = filesAttached.findIndex((fileItem) => fileItem.name === file.name)
                    if (filePosition === -1) {
                        const fileName = file.name
                        const dateUploaded = new Date().toLocaleString()
                        const newId = uuid()
                        const newFile = { id: newId, name: fileName, size: fileSizeKb, date: dateUploaded, file: file }
                        setFilesAttached((prev) => [...prev, newFile])
                    } else {
                        showSnackbar({
                            severity: 'error',
                            children: 'This file has been added, please add another file',
                        })
                    }
                }
                formRef.current.reset()
            }
        }
    }

    const handleDeleteFile = (id) => {
        const updatedFiles = filesAttached.filter((file) => file.id !== id)
        setFilesAttached(updatedFiles)
    }

    const handleSubmitRevisions = () => {
        setButtonLoading(true)
        const formData = new FormData()
        filesAttached.forEach((file) => formData.append('files', file.file))
        const presentationFilesCreate = createPresentationFiles(submissionId, formData)
        const presentersCreate = createPresenters(submissionId, presenterIds)

        Promise.all([presentationFilesCreate, presentersCreate])
            .then(() => {
                showSnackbar({
                    severity: 'success',
                    children: 'Upload Presentation Successfully',
                })
                if (roleName === ROLES_NAME.AUTHOR) {
                    history.push(`/conferences/${conferenceId}/submission/author`)
                } else if (roleName === ROLES_NAME.CHAIR || roleName === ROLES_NAME.TRACK_CHAIR) {
                    history.push(`/conferences/${conferenceId}/manuscript`)
                }
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, cannot upload question image.',
                })
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const thirdController = new AbortController()

        const submissionInfoGet = getSubmissionInfo(submissionId, controller.signal)
        const summaryGet = getSubmissionSummary(submissionId, secondController.signal)

        if (submissionId) {
            Promise.all([submissionInfoGet, summaryGet])
                .then((response) => {
                    const data = response[0].data
                    const summaryInfo = response[1].data
                    const authors = summaryInfo.authors.map((author) => ({
                        participantId: author.participantId,
                        fullName: author.authorFullName,
                        email: author.authorEmail,
                    }))
                    getPresentationSetting(response[0].data.trackId, thirdController.signal).then((res) => {
                        const presentationSetting = res.data.result.presentationFileSettings
                        setSettings({ presentationSetting })
                    })
                    setAuthors(authors)
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
                thirdController.abort()
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Typography fontWeight={600} mt={3} variant="h5" mb={2}>
                    Upload Presentation files
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
                            <Typography fontWeight={700}>Paper title</Typography>
                            <Typography fontWeight={700}>Track name</Typography>
                        </Grid>
                        <Grid item lg={9}>
                            <IDField id={generalInfo?.submissionId} showButton={true} />
                            <Typography>{generalInfo?.title}</Typography>
                            <Typography>{generalInfo?.trackName}</Typography>
                        </Grid>
                    </Grid>
                )}
                <CheckPresenters
                    loading={loading}
                    listChecked={authors}
                    setListChecked={setPresenterIds}
                    presenterIds={presenterIds}
                />
                <FilesAttached
                    filesAttached={filesAttached}
                    handleUploadFiles={handleUploadFiles}
                    handleDeleteFile={handleDeleteFile}
                    config={settings}
                    ref={formRef}
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
                            onClick={() => history.goBack()}
                        >
                            Go Back
                        </Button>
                    </Box>
                    <Box ml={4}>
                        <LoadingButton
                            sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                            variant="contained"
                            onClick={handleSubmitRevisions}
                            disabled={filesAttached.length === 0 || presenterIds.length === 0}
                            loading={buttonLoading}
                            loadingPosition="start"
                            startIcon={<Upload />}
                        >
                            Upload Presentation
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </ConferenceDetail>
    )
}

export default UploadPresentation
