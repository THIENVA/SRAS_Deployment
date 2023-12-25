import { useEffect, useRef, useState } from 'react'

import axios from 'axios'
import JSZip from 'jszip'
import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Upload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import FilesAttached from './FilesAttached'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useTrack } from '~/api/common/track'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const UploadSupplementary = () => {
    const { conferenceId, submissionId } = useParams()
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { uploadSupplementary, getSubmissionInfo } = usePaperSubmission()
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const [generalInfo, setGeneralInfo] = useState(null)
    const [filesAttached, setFilesAttached] = useState([])
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const { getSubmissionSettings } = useTrack()
    const [settings, setSettings] = useState(null)
    const formRef = useRef(null)
    const [error, setError] = useState(false)
    const [messageError, setMessageError] = useState('')

    const handleUploadFiles = (event) => {
        const file = event.target.files[0]
        if (file) {
            const fileSizeKb = (file.size / 1024).toFixed(2)
            const maximumSize = settings ? settings.supplementaryMaterialSettings[3].value * 1024 : null
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
                setMessageError('')
                setError(false)
            }
            formRef.current.reset()
        }
    }

    const handleDeleteFile = (id) => {
        const updatedFiles = filesAttached.filter((file) => file.id !== id)
        setFilesAttached(updatedFiles)
    }

    const handleSubmitRevisions = () => {
        const isFiles =
            !settings && filesAttached.length < settings.supplementaryMaterialSettings[2].value
                ? false
                : filesAttached.length >= settings.supplementaryMaterialSettings[2].value
        if (!isFiles) {
            setError(true)
            const message =
                !isFiles && filesAttached.length === 0
                    ? 'At least one file is required'
                    : settings && filesAttached.length < settings.supplementaryMaterialSettings[2].value
                    ? 'The files is less than minimum files required'
                    : ''
            setMessageError(message)
        } else {
            setButtonLoading(true)
            const formData = new FormData()
            filesAttached.forEach((file) => formData.append('files', file.file))
            uploadSupplementary(submissionId, formData)
                .then(() => {
                    showSnackbar({
                        severity: 'success',
                        children: 'Upload Supplementary Material Successfully',
                    })
                    if (roleName === ROLES_NAME.AUTHOR) {
                        history.push(`/conferences/${conferenceId}/submission/author`)
                    } else {
                        history.push(`/conferences/${conferenceId}/submission/submission-console`)
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
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        getSubmissionInfo(submissionId, controller.signal)
            .then((response) => {
                const data = response.data
                setGeneralInfo(data)
                getSubmissionSettings(data.trackId, secondController.signal).then((res) => {
                    setSettings(res.data)
                })
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
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        axios({
            url: `${APP_API_URL}/submissions/${submissionId}/download-supplementary-material-files`,
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
    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Typography fontWeight={600} mt={3} variant="h5" mb={2}>
                    Upload Supplementary Material files
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
                <FilesAttached
                    filesAttached={filesAttached}
                    handleUploadFiles={handleUploadFiles}
                    handleDeleteFile={handleDeleteFile}
                    config={settings}
                    ref={formRef}
                    error={error}
                    messageError={messageError}
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
                            disabled={buttonLoading}
                            loading={buttonLoading}
                            loadingPosition="start"
                            startIcon={<Upload />}
                        >
                            Upload Supplementary Material
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </ConferenceDetail>
    )
}

export default UploadSupplementary
