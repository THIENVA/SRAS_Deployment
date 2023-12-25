import { useEffect, useState } from 'react'

import axios from 'axios'
import JSZip from 'jszip'
import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import FilesAttached from './FilesAttached'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { usePaperSubmission } from '~/api/common/paper-submission'
import usePresentation from '~/api/common/presentation'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'

const UpdatePresentationFiles = () => {
    const { conferenceId, submissionId } = useParams()
    const { createPresentationFiles } = usePresentation()
    const { getSubmissionInfo } = usePaperSubmission()
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const [generalInfo, setGeneralInfo] = useState(null)
    const [filesAttached, setFilesAttached] = useState([])
    const [isDisable, setDisable] = useState(false)
    const [loading, setLoading] = useState(true)

    const handleUploadFiles = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (filesAttached.length === 0) {
                const fileSizeKb = (file.size / 1024).toFixed(2)
                const fileName = file.name
                const dateUploaded = new Date().toLocaleString()
                const newId = uuid()
                const newFile = { id: newId, name: fileName, size: fileSizeKb, date: dateUploaded, file: file }
                setFilesAttached((prev) => [...prev, newFile])
            } else {
                const filePosition = filesAttached.findIndex((fileItem) => fileItem.name === file.name)
                if (filePosition === -1) {
                    const fileSizeKb = (file.size / 1024).toFixed(2)
                    const fileName = file.name
                    const dateUploaded = new Date().toLocaleString()
                    const newId = uuid()
                    const newFile = { id: newId, name: fileName, size: fileSizeKb, date: dateUploaded, file: file }
                    setFilesAttached((prev) => [...prev, newFile])
                } else {
                    showSnackbar({ severity: 'error', children: 'This file has been added, please add another file' })
                }
            }
        }
    }

    const handleDeleteFile = (id) => {
        const updatedFiles = filesAttached.filter((file) => file.id !== id)
        setFilesAttached(updatedFiles)
    }

    const handleSubmitRevisions = () => {
        setDisable(true)
        const formData = new FormData()
        filesAttached.forEach((file) => formData.append('files', file.file))
        createPresentationFiles(submissionId, formData)
            .then(() => {
                // showSnackbar({
                //     severity: 'success',
                //     children: 'Upload Presentation Successfully',
                // })
                history.push(`/conferences/${conferenceId}/submission/submission-console`)
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
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getSubmissionInfo(submissionId, signal)
            .then((response) => {
                const data = response.data
                setGeneralInfo(data)
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
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
            url: `${APP_API_URL}/submissions/${submissionId}/download-presentation-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
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
                    Update Presentation files
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
                            {/* <Typography>{generalInfo?.submissionId}</Typography> */}
                            <Typography>{generalInfo?.title}</Typography>
                            <Typography>{generalInfo?.trackName}</Typography>
                        </Grid>
                    </Grid>
                )}
                <FilesAttached
                    filesAttached={filesAttached}
                    handleUploadFiles={handleUploadFiles}
                    handleDeleteFile={handleDeleteFile}
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
                            disabled={isDisable}
                            loading={isDisable}
                            loadingPosition="start"
                            startIcon={<Save />}
                        >
                            Save Changes
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </ConferenceDetail>
    )
}

export default UpdatePresentationFiles
