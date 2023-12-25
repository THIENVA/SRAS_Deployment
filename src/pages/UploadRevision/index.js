import React, { useEffect, useRef, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Upload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import FilesAttached from './FilesAttached'
import TitleSection from './TitleSection'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { usePaperSubmission } from '~/api/common/paper-submission'
import useRevision from '~/api/common/revision'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const UploadRevision = () => {
    const { conferenceId, submissionId } = useParams()
    const { firstName, lastName, middleName } = useAppSelector((state) => state.auth)
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { uploadRevision } = useRevision()
    const { getSubmissionInfo, getAuthorReviewers } = usePaperSubmission()
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const [generalInfo, setGeneralInfo] = useState(null)
    const [filesAttached, setFilesAttached] = useState([])
    const [reviewers, setReviewers] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingInfo, setLoadingInfo] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [isChecked, setCheck] = useState(false)
    const { getSubmissionSettings } = useTrack()
    const formRef = useRef(null)
    const [settings, setSettings] = useState(null)
    const [error, setError] = useState(false)
    const [messageError, setMessageError] = useState('')

    const handleCheck = (event) => {
        setCheck(event.target.checked)
    }

    const handleUploadFiles = (event) => {
        const file = event.target.files[0]
        if (file) {
            const fileSizeKb = (file.size / 1024).toFixed(2)
            const maximumSize = settings ? settings.revisionSettings[3].value * 1024 : null
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
                        const fileSizeKb = (file.size / 1024).toFixed(2)
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
            !settings && filesAttached.legtn < settings.revisionSettings[2].value
                ? false
                : filesAttached.length >= settings.revisionSettings[2].value
        if (!isFiles) {
            setError(true)
            const message =
                !isFiles && filesAttached.length === 0
                    ? 'At least one file is required'
                    : settings && filesAttached.length < settings.revisionSettings[2].value
                    ? 'The files is less than minimum files required'
                    : ''
            setMessageError(message)
        } else {
            setButtonLoading(true)
            const formData = new FormData()
            filesAttached.forEach((file) => formData.append('files', file.file))
            uploadRevision(submissionId, formData)
                .then(() => {
                    showSnackbar({
                        severity: 'success',
                        children: 'Upload Revision Successfully',
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
        if (submissionId) {
            getSubmissionInfo(submissionId, controller.signal)
                .then((response) => {
                    const data = response.data
                    setGeneralInfo(data)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later.',
                    })
                })
                .finally(() => {
                    setLoadingInfo(false)
                })

            return () => {
                controller.abort()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissionId])

    useEffect(() => {
        const controller = new AbortController()
        if (submissionId) {
            getAuthorReviewers(submissionId, controller.signal)
                .then((response) => {
                    const data = response.data
                    setReviewers(data.reviews ? data.reviews : [])
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissionId])

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
                setLoadingInfo(false)
            })

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isDisable = !isChecked

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Typography fontWeight={600} mt={3} variant="h5" mb={2}>
                    Upload Revision Files
                </Typography>
                {loadingInfo ? (
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
                {loading ? (
                    <Loading height="80vh" />
                ) : (
                    <React.Fragment>
                        {settings?.revisionInstruction && (
                            <Box
                                sx={{
                                    borderRadius: 2,
                                    p: 2,
                                    m: 2,
                                    backgroundColor: AppStyles.colors['#F5F5F5'],
                                    border: '0.5px solid #cecdcd',
                                }}
                            >
                                <Typography gutterBottom sx={{ fontSize: 16 }}>
                                    {settings?.revisionInstruction}
                                </Typography>
                            </Box>
                        )}
                        {reviewers.map((reviewer, index) => (
                            <Box mt={4} key={index}>
                                <TitleSection>
                                    <Box display="flex" alignItems={'center'}>
                                        <Typography sx={{ fontWeight: 'bold' }}>Reviewer #{index + 1}</Typography>
                                    </Box>
                                </TitleSection>
                                <Box ml={1}>
                                    <Typography mb={1} sx={{ fontSize: 18, fontWeight: 'bold' }}>
                                        Reviewer Reviews
                                    </Typography>
                                    {reviewer.totalScore ? (
                                        <React.Fragment>
                                            <Box mb={1} ml={2} display="flex" alignItems={'center'}>
                                                <Typography sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}>
                                                    Average Evaluation score (Average Score of Above Criteria):
                                                </Typography>
                                                {reviewer.totalScore && (
                                                    <Typography ml={1} sx={{ fontSize: 16 }}>
                                                        {reviewer.totalScore}/100
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box ml={1} mb={1} alignItems={'center'}>
                                                <Typography sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}>
                                                    Comments for Authors:
                                                </Typography>
                                                {reviewer.commentsForAuthors && (
                                                    <Box
                                                        sx={{
                                                            mt: 1,
                                                            backgroundColor: AppStyles.colors['#F5F5F5'],
                                                            border: '1px solid rgba(0, 0, 0, 0.15)',
                                                            p: 1,
                                                            borderRadius: 1,
                                                            maxWidth: 600,
                                                        }}
                                                    >
                                                        <Typography
                                                            component={'pre'}
                                                            sx={{
                                                                fontSize: 14,
                                                                color: AppStyles.colors['#586380'],
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: 'monospace',
                                                            }}
                                                        >
                                                            {reviewer.commentsForAuthors}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </React.Fragment>
                                    ) : (
                                        <Typography sx={{ fontStyle: 'italic' }}>Reviewer has not review.</Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                        <FilesAttached
                            filesAttached={filesAttached}
                            handleUploadFiles={handleUploadFiles}
                            handleDeleteFile={handleDeleteFile}
                            config={settings}
                            error={error}
                            messageError={messageError}
                            ref={formRef}
                        />
                        <Box mt={3} display={'flex'} alignItems={'center'}>
                            <FormControlLabel
                                control={<Checkbox value={isChecked} onChange={handleCheck} />}
                                sx={{ mr: 0 }}
                            />
                            <Typography sx={{ fontSize: 18, ml: 1 }}>
                                I,{' '}
                                <strong>
                                    {firstName} {middleName && middleName} {lastName}
                                </strong>
                                , have thoroughly reviewed the feedback and made the necessary edits as per the
                                requirements, in preparation for submitting the revision.
                            </Typography>
                        </Box>
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
                                    loading={buttonLoading}
                                    loadingPosition="start"
                                    startIcon={<Upload />}
                                >
                                    Upload Revision
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
